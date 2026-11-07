import { copyToClipboard } from "./utils/copyToClipboard.js";
import { advicePopup, popupBackdrop } from "./utils/menu.js";

let adviceURL = JSON.parse(localStorage.getItem('adviceURL')) || 'https://api.adviceslip.com/advice';

let adviceConfig = JSON.parse(localStorage.getItem('adviceConfig')) || {
  category: 'random',
  searchById: {
    isAllowed: false,
    searchId: null
  },
  searchByKeyword: {
    isAllowed: false,
    searchKeyword: null
  }
};

const saveAdviceCustomisationButton = document.querySelector('.js-save-advice-customisation');
const resetAdviceCustomisationButton = document.querySelector('.js-reset-advice-customisation');

let saveAdviceTimeoutId;
let resetAdviceTimeoutId;

saveAdviceCustomisationButton.addEventListener('click', () => {
  saveAdviceCustomisation();

  saveAdviceCustomisationButton.innerHTML = 'Customisation Saved';

  if (saveAdviceTimeoutId) {
    clearTimeout(saveAdviceTimeoutId);
  }

  saveAdviceTimeoutId = setTimeout(() => {
    saveAdviceCustomisationButton.innerHTML = 'Save Customisation';
  }, 2000);

  advicePopup.classList.add('hide-popup');
  popupBackdrop.classList.add('hide-popup');
});

resetAdviceCustomisationButton.addEventListener('click', () => {
  resetAdviceCustomisation();

  resetAdviceCustomisationButton.innerHTML = 'Customisation Reset';

  if (resetAdviceTimeoutId) {
    clearTimeout(resetAdviceTimeoutId);
  }

  resetAdviceTimeoutId = setTimeout(() => {
    resetAdviceCustomisationButton.innerHTML = 'Reset Customisation';
  }, 2000);  
});

const randomAdviceRadio = document.querySelector('.js-random-advice-radio');
const customAdviceRadio = document.querySelector('.js-custom-advice-radio');
const dailyAdviceRadio = document.querySelector('.js-daily-advice-radio');

const allowAdviceIdSearch = document.querySelector('.js-allow-advice-id-search');
const allowAdviceKeywordSearch = document.querySelector('.js-allow-advice-keyword-search');

const adviceIdInput = document.querySelector('.js-advice-id-input');
const adviceKeywordInput = document.querySelector('.js-advice-keyword-input');

randomAdviceRadio.addEventListener('change', () => {
  if (randomAdviceRadio.checked) {
    changeCategory(randomAdviceRadio.value);
    handleCustomSearch();
  }
});

customAdviceRadio.addEventListener('change', () => {
  if (customAdviceRadio.checked) {
    changeCategory(customAdviceRadio.value);
    handleCustomSearch();
  }
});

dailyAdviceRadio.addEventListener('change', () => {
  if (dailyAdviceRadio.checked) {
    changeCategory(dailyAdviceRadio.value);
    handleCustomSearch();
  }
});

allowAdviceIdSearch.addEventListener('change', () => {
  adviceIdInput.disabled = false;
  adviceKeywordInput.disabled = true;
  adviceKeywordInput.value = '';

  adviceConfig.searchByKeyword.isAllowed = false;
  adviceConfig.searchById.isAllowed = true;
  adviceConfig.searchByKeyword.searchKeyword = null;

  validateCustomSearch(adviceIdInput);
});

allowAdviceKeywordSearch.addEventListener('change', () => {
  adviceIdInput.disabled = true;
  adviceKeywordInput.disabled = false;
  adviceIdInput.value = '';

  adviceConfig.searchById.isAllowed = false;
  adviceConfig.searchByKeyword.isAllowed = true;
  adviceConfig.searchById.searchId = null;

  validateCustomSearch(adviceKeywordInput);
});

adviceIdInput.addEventListener('input', () => {
  adviceConfig.searchById.searchId = Number(adviceIdInput.value);
  validateCustomSearch(adviceIdInput);
});

adviceKeywordInput.addEventListener('input', () => {
  adviceConfig.searchByKeyword.searchKeyword = adviceKeywordInput.value;
  validateCustomSearch(adviceKeywordInput);
});

function validateCustomSearch(inputElement) {
  if (inputElement.value.trim()) {
    saveAdviceCustomisationButton.disabled = false;
  } else {
    saveAdviceCustomisationButton.disabled = true;
  }
}

function changeCategory(category) {
  adviceConfig.searchById.isAllowed = false;
  adviceConfig.searchByKeyword.isAllowed = false;
  adviceConfig.searchById.searchId = null;
  adviceConfig.searchByKeyword.searchKeyword = null;

  adviceConfig.category = category;
}

function saveConfigToStorage() {
  localStorage.setItem('adviceConfig', JSON.stringify(adviceConfig));
}

function handleCustomSearch() {
  if (customAdviceRadio.checked) {
    allowAdviceIdSearch.disabled = false;
    allowAdviceKeywordSearch.disabled = false;
    saveAdviceCustomisationButton.disabled = true;

  } else {
    allowAdviceIdSearch.disabled = true;
    allowAdviceKeywordSearch.disabled = true;
    saveAdviceCustomisationButton.disabled = false;

    allowAdviceIdSearch.checked = false;
    adviceIdInput.disabled = true;

    allowAdviceKeywordSearch.checked = false;
    adviceKeywordInput.disabled = true;

    adviceIdInput.value = '';
    adviceKeywordInput.value = '';
  }
}


function saveAdviceCustomisation() {
  if (adviceConfig.category === 'random') {
    adviceURL = 'https://api.adviceslip.com/advice';
  } else if (adviceConfig.category === 'custom') {
    adviceURL = buildCustomAdviceURL();
  } else if (adviceConfig.category === 'daily-advice') {
    adviceURL = 'https://api.adviceslip.com/daily_adviceslip.rss';
  }

  localStorage.setItem('adviceConfig', JSON.stringify(adviceConfig));
  localStorage.setItem('adviceURL', JSON.stringify(adviceURL));
}

function buildCustomAdviceURL() {
  let url;
  const id = Number(adviceConfig.searchById.searchId);
  const query = adviceConfig.searchByKeyword.searchKeyword;

  if (adviceConfig.searchById.isAllowed) {
    url = `https://api.adviceslip.com/advice/${id}`;
  } else if (adviceConfig.searchByKeyword.isAllowed) {
    url = `https://api.adviceslip.com/advice/search/${query}`;
  }

  return url;
}

function resetAdviceCustomisation() {
  localStorage.removeItem('adviceConfig');
  localStorage.removeItem('adviceURL');

  adviceConfig.category = 'random';
  adviceConfig.searchById.isAllowed = false;
  adviceConfig.searchByKeyword.isAllowed = false;
  adviceConfig.searchById.searchId = null;
  adviceConfig.searchByKeyword.searchKeyword = null;

  adviceURL = 'https://api.adviceslip.com/advice';

  applySavedAdviceConfigs();
  handleCustomSearch();

  // console.log(adviceConfig);
  // console.log(adviceURL);
}

function applySavedAdviceConfigs() {
  if (adviceConfig.category === 'random') {
    randomAdviceRadio.checked = true;
  } else if (adviceConfig.category === 'custom') {
    customAdviceRadio.checked = true;
    allowAdviceIdSearch.disabled = false;
    allowAdviceKeywordSearch.disabled = false;
  } else if (adviceConfig.category === 'daily-advice') {
    dailyAdviceRadio.checked = true;
  }

  if (customAdviceRadio.checked) {
    if (adviceConfig.searchById.isAllowed) {
      adviceIdInput.disabled = false;
      adviceIdInput.value = adviceConfig.searchById.searchId;
    } else if (adviceConfig.searchByKeyword.isAllowed) {
      adviceKeywordInput.disabled = false;
      adviceKeywordInput.value = adviceConfig.searchByKeyword.searchKeyword;
    }
  }
}

applySavedAdviceConfigs();

async function getAdvice() {
  const response = await fetch(adviceURL);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Server Error. Response Status: ${response.status}`);
  }

  if (responseData.slip) {
    return {
      type: 'singleAdvice',
      data: responseData
    };

  } else if (responseData.query) {
    return {
      type: 'queryAdvice',
      data: responseData
    };

  } else if (responseData.message) {
    return {
      type: 'error',
      data: responseData
    };
  }
}

async function getDailyAdvice() {
  const response = await fetch('https://api.adviceslip.com/daily_adviceslip.rss');
  
  if (!response.ok) {
    throw new Error(`Server Error. Response Status: ${response.status}`);
  }

  const responseData = await response.text();

  return responseData;
}

let timeoutId;

const contentContainer = document.querySelector('.js-joke-advice-container');
const banner = document.querySelector('.js-banner');
const bannerContentContainer = document.querySelector('.js-banner-content');
const closeBannerButton = document.querySelector('.js-close-banner-button');

if (closeBannerButton) {
  closeBannerButton.addEventListener('click', () => {
    banner.classList.add('hide');
  });
}

const tellAJokeButton = document.querySelector('.js-tell-a-joke');
const giveAdviceButton = document.querySelector('.js-give-advice');

giveAdviceButton.addEventListener('click', () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  banner.classList.add('hide');

  giveAdviceButton.disabled = true;
  tellAJokeButton.disabled = true;

  contentContainer.innerHTML = 'Loading advice...';
  renderAdvice();
});

export async function renderAdvice() {
  try {
    const html = await giveAdvice();

    contentContainer.innerHTML = html;

    const copyButtons = document.querySelectorAll('.js-copy');

    copyButtons.forEach(copyButton => {
      copyButton.addEventListener('click', async () =>  {
        banner.classList.add('hide');

        const { adviceId } = copyButton.dataset;

        const text = document.querySelector(`.js-advice-${adviceId}`).innerText;
        await copyToClipboard(text, adviceId);
      });
    });

    timeoutId = setTimeout(() => {
      giveAdviceButton.disabled = false;
      tellAJokeButton.disabled = false;
    }, 2000);

  } catch (error) {
    console.error('Unexpected error occured', error);
    
    banner.classList.remove('hide');

    bannerContentContainer.innerHTML = `
      <div>
        ${error}. Please try again later.
      </div>
    `;

    contentContainer.innerHTML = `
      <div><i class="fa-solid fa-face-frown" style="color:#3b0000; font-size:50px"></i></div>
    `;

    timeoutId = setTimeout(() => {
      giveAdviceButton.disabled = false;
      tellAJokeButton.disabled = false;
    }, 2000);
  }
}

async function giveAdvice() {
  let adviceHTML = '';

  if (adviceConfig.category === 'daily-advice') {
    const responseData = await getDailyAdvice();

    const parser = new DOMParser();
    const htmlResponse = parser.parseFromString(responseData, 'text/html');

    const dateElement = htmlResponse.querySelector('pubdate');
    const adviceElement = htmlResponse.getElementsByTagName('media:title');

    const idElement = htmlResponse.getElementsByTagName('a');
    const adviceId = idElement[0].hash.slice(1);

    const adviceData = {
      id: idElement ? adviceId : null,
      date: dateElement ? new Date(dateElement.textContent) : null,
      advice: adviceElement ? adviceElement[0].textContent : null
    }

    // console.log(adviceData);

    adviceHTML = `
      <div class="advice-content">
        <div>
          <button class="copy js-copy js-copy-${adviceId}" title="Copy Advice" data-advice-id=${adviceId}>
            <i class="fa-regular fa-copy copy-hover"></i>
            <i class="fa-solid fa-copy copy-active"></i>
          </button>
        </div>

        <div class="advice-info">
          Advice for the the Day: ${adviceData.date.toDateString()}
        </div>

        <div class="joke-advice-body js-advice js-advice-${adviceId}">
          ${adviceData.advice}
        </div>
      </div>
    `;

    return adviceHTML;
  }

  const responseData = await getAdvice();

  if (responseData.type === 'singleAdvice') {
    adviceHTML = `
      <div class="advice-content">
        <div>
          <button class="copy js-copy js-copy-${responseData.data.slip.id}" title="Copy Advice" data-advice-id=${responseData.data.slip.id}>
            <i class="fa-regular fa-copy copy-hover"></i>
            <i class="fa-solid fa-copy copy-active"></i>
          </button>
        </div>

        <div class="advice-info">Advice #${responseData.data.slip.id}</div>

        <div class="joke-advice-body js-advice js-advice-${responseData.data.slip.id}">
          ${responseData.data.slip.advice}
        </div>
      </div>
    `;

    return adviceHTML;

  } else if (responseData.type === 'queryAdvice') {
    adviceHTML = `
      <div class="advice-query-info">
        <div>
          Results for:
          <span class="query-string">"${responseData.data.query}"</span>
        </div>

        <div>
          Total results found:
          <span class="query-number">${responseData.data.total_results}</span>
        </div>
      </div>
    `;

    responseData.data.slips.forEach(slip => {
      adviceHTML += `
        <div class="advice-content">
          <div>
            <button class="copy js-copy js-copy-${slip.id}" title="Copy Advice" data-advice-id=${slip.id}>
              <i class="fa-regular fa-copy copy-hover"></i>
              <i class="fa-solid fa-copy copy-active"></i>
            </button>
          </div>

          <div class="advice-info">Advice #${slip.id}</div>

          <div class="joke-advice-body js-advice js-advice-${slip.id}">
            ${slip.advice}
          </div>

          <div class="advice-date">Date: ${slip.date}</div>
        </div>
      `;
    });

    return adviceHTML;

  } else if (responseData.type === 'error') {    
    adviceHTML = `
      <div class="error-container">
        <div class="advice-info">${responseData.data.message.type}</div>

        <div><i class="fa-solid fa-face-frown" style="color:#3b0000; font-size:50px"></i></div>

        <div class="joke-advice-body js-advice">
          ${responseData.data.message.text}
        </div>
      </div>
    `;

    return adviceHTML;
  }
}