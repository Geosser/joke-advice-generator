import { copyToClipboard } from "./utils/copyToClipboard.js";
import { advicePopup } from "./utils/menu.js";

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
  console.log('advice customisation saved');
  saveAdviceCustomisation();

  saveAdviceCustomisationButton.innerHTML = 'Customisation Saved';

  if (saveAdviceTimeoutId) {
    clearTimeout(saveAdviceTimeoutId);
  }

  saveAdviceTimeoutId = setTimeout(() => {
    saveAdviceCustomisationButton.innerHTML = 'Save Customisation';
  }, 2000);
});

resetAdviceCustomisationButton.addEventListener('click', () => {
  console.log('resetting customisation...');
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

  console.log(adviceConfig);
});

allowAdviceKeywordSearch.addEventListener('change', () => {
  adviceIdInput.disabled = true;
  adviceKeywordInput.disabled = false;
  adviceIdInput.value = '';

  adviceConfig.searchById.isAllowed = false;
  adviceConfig.searchByKeyword.isAllowed = true;
  adviceConfig.searchById.searchId = null;

  validateCustomSearch(adviceKeywordInput);

  console.log(adviceConfig);
});

adviceIdInput.addEventListener('input', () => {
  adviceConfig.searchById.searchId = Number(adviceIdInput.value);
  console.log(adviceConfig);
  validateCustomSearch(adviceIdInput);
});

adviceKeywordInput.addEventListener('input', () => {
  adviceConfig.searchByKeyword.searchKeyword = adviceKeywordInput.value;
  console.log(adviceConfig);
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

  console.log(adviceConfig);
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

  console.log(adviceConfig);
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

  console.log(adviceConfig);
  console.log(adviceURL);
}

async function getAdvice() {
  const response = await fetch(adviceURL);
  
  if (!response.ok) {
    throw new Error(`Server Error. Response Status: ${response.status}`);
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

async function getDailyAdvice() {
  const response = await fetch('https://api.adviceslip.com/daily_adviceslip.rss');
  
  if (!response.ok) {
    throw new Error(`Server Error. Response Status: ${response.status}`);
  }

  const responseData = await response.text();
  console.log(responseData);
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

    const copyButton = document.querySelector('.js-copy');
    copyButton.addEventListener('click', async () =>  {
      banner.classList.add('hide');
      const text = document.querySelector('.js-advice').innerText;
      await copyToClipboard(text);
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
  const adviceSlip = await getAdvice();
  const advice = adviceSlip.slip;

  const adviceHTML = `
    <div class="advice-content">
      <div>
        <button class="copy js-copy" title="Copy Advice">
          <i class="fa-regular fa-copy copy-hover"></i>
          <i class="fa-solid fa-copy copy-active"></i>
        </button>
      </div>

      <div class="advice-info">Advice #${advice.id}</div>

      <div class="joke-advice-body js-advice">
        ${advice.advice}
      </div>
    </div>
  `;

  return adviceHTML;
}