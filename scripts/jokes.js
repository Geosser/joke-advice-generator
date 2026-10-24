import { copyToClipboard } from "./utils/copyToClipboard.js";
import { jokePopup, popupBackdrop } from "./utils/menu.js";

let url = JSON.parse(localStorage.getItem('url')) || 'https://v2.jokeapi.dev/joke/Any?type=single&amount=1';

const jokeConfig = JSON.parse(localStorage.getItem('jokeConfig')) || {
  categories: ['Any'],
  blacklistFlags: [],
  type: 'single',
  amount: 1,
  searchById: {
    isAllowed: false,
    searchId: ''
  },
  searchByKeyword: {
    isAllowed: false,
    searchKeyword: ''
  }
}

const saveJokeCustomisationButton = document.querySelector('.js-save-joke-customisation');
saveJokeCustomisationButton.addEventListener('click', () => {
  saveJokeCustomisation();
});

const resetJokeCustomisationButton = document.querySelector('.js-reset-joke-customisation');
resetJokeCustomisationButton.addEventListener('click', () => {
  resetJokeCustomisation();
});

const anyJokeRadio = document.querySelector('.js-any-joke-radio');
const customJokeRadio = document.querySelector('.js-custom-joke-radio');
const customCategoriesCheckboxes = document.querySelectorAll('.custom-category input[type="checkbox"]');

customJokeRadio.addEventListener('change', (event) => {
  toggleJokeCustomCategories(true);

  saveJokeCustomisationButton.disabled = true;

  document.querySelector('.js-custom-category')
    .addEventListener('change', () => {
      saveJokeCustomisationButton.disabled = true;

      customCategoriesCheckboxes.forEach(category => {
        if (category.checked) {
          saveJokeCustomisationButton.disabled = false;
          checkSearchValidity();
        }
      });
    });
});

anyJokeRadio.addEventListener('change', () => {
  toggleJokeCustomCategories(false);
  saveJokeCustomisationButton.disabled = false;
  checkSearchValidity();
});

function toggleJokeCustomCategories(enable) {
  customCategoriesCheckboxes.forEach(category => {
    category.disabled = !enable;
    if(!enable) {
      category.checked = false;
    }
  });
}

const singleTypeRadio = document.querySelector('.js-single-type-radio');
const twopartTypeRadio = document.querySelector('.js-twopart-type-radio');

const blacklistFlags = document.querySelectorAll('.js-custom-blacklist input[type="checkbox"]');

const amountInput = document.querySelector('.js-joke-amount');

singleTypeRadio.addEventListener('change', () => {
  amountInput.disabled = false;
});

twopartTypeRadio.addEventListener('change', () => {
  amountInput.value = 1;
  amountInput.disabled = true;
});

const allowJokeIdSearchCheckbox = document.querySelector('.js-allow-joke-id-search');
const jokeIdInput = document.querySelector('.js-joke-id-number');

if (allowJokeIdSearchCheckbox) {
  allowJokeIdSearchCheckbox.addEventListener('change', () => {
    toggleAllow(allowJokeIdSearchCheckbox, jokeIdInput);
    if (allowJokeIdSearchCheckbox.checked) {
      jokeConfig.searchById.isAllowed = true;
    } else {
      jokeConfig.searchById.isAllowed = false;
    }
  });
}

const allowJokeKeywordSearchCheckbox = document.querySelector('.js-allow-joke-keyword-search');
const jokeKeywordInput = document.querySelector('.js-joke-keyword');

if (allowJokeKeywordSearchCheckbox) {
  allowJokeKeywordSearchCheckbox.addEventListener('change', () => {
    toggleAllow(allowJokeKeywordSearchCheckbox, jokeKeywordInput);
    if (allowJokeKeywordSearchCheckbox.checked) {
      jokeConfig.searchByKeyword.isAllowed = true;
    } else {
      jokeConfig.searchByKeyword.isAllowed = false;
    }
  });
}

function toggleAllow(checkbox, inputElement) {    
  if (checkbox.checked) {
    inputElement.disabled = false;
  } else if(!checkbox.checked) {
    inputElement.disabled = true;
    inputElement.value = '';
  }

  checkSearchValidity();
}

function checkSearchValidity() {
  const jokeIdInputInvalid = !jokeIdInput.disabled && !jokeIdInput.value.trim();
  const jokeKeywordInputInvalid = !jokeKeywordInput.disabled && !jokeKeywordInput.value.trim();

  const textInputsInvalid = jokeIdInputInvalid || jokeKeywordInputInvalid;

  let customCategoriesChecked = 0;

  customCategoriesCheckboxes.forEach(category => {
    if (category.checked) {
      customCategoriesChecked += 1;
    }
  });

  const noCheckboxChecked = customCategoriesChecked === 0;

  const categoriesValid = anyJokeRadio.checked || !noCheckboxChecked;

  if (textInputsInvalid || !categoriesValid) {
    saveJokeCustomisationButton.disabled = true;
  } else {
    saveJokeCustomisationButton.disabled = false;
  }
}

validateSearch(jokeIdInput);
validateSearch(jokeKeywordInput);

checkSearchValidity();

function validateSearch(inputElement) {
  inputElement.addEventListener('input', () => {
    checkSearchValidity();
  });
}

let saveJokeTimeoutId;
let resetJokeTimeoutId;

function saveJokeCustomisation() {
  if (anyJokeRadio.checked) {
    jokeConfig.categories = [];
    jokeConfig.categories.push(anyJokeRadio.value);
  } else if (customJokeRadio.checked) {
    jokeConfig.categories = [];

    customCategoriesCheckboxes.forEach(category => {
      if (category.checked) {
        jokeConfig.categories.push(category.value);
      }
    });
  }

  if (singleTypeRadio.checked) {
    jokeConfig.type = singleTypeRadio.value;
  } else if (twopartTypeRadio.checked) {
    jokeConfig.type = twopartTypeRadio.value;
  }

  jokeConfig.blacklistFlags = [];

  blacklistFlags.forEach(flag => {
    if (flag.checked) {
      jokeConfig.blacklistFlags.push(flag.value);
    }
  });

  if (Number(amountInput.value) > 10 || Number(amountInput.value) < 1) {
    alert("Joke amount must be between 1 and 10 (inclusive)");
    return;
  }

  jokeConfig.amount = Number(amountInput.value) || 1;

  jokeConfig.searchById.searchId = jokeIdInput.value !== '' ? Number(jokeIdInput.value) : '';

  jokeConfig.searchByKeyword.searchKeyword = jokeKeywordInput.value;

  url = `https://v2.jokeapi.dev/joke/${jokeConfig.categories.join(',')}?type=${jokeConfig.type}&blacklistFlags=${jokeConfig.blacklistFlags.join(',')}&amount=${jokeConfig.amount}&contains=${jokeConfig.searchByKeyword.searchKeyword}&idRange=${jokeConfig.searchById.searchId}`;

  localStorage.setItem('url', JSON.stringify(url));
  localStorage.setItem('jokeConfig', JSON.stringify(jokeConfig));

  applySavedJokeConfigs();

  if (saveJokeTimeoutId) {
    clearTimeout(saveJokeTimeoutId);
  }
  
  saveJokeCustomisationButton.innerHTML = 'Customisation Saved';

  saveJokeTimeoutId = setTimeout(() => {
    saveJokeCustomisationButton.innerHTML = 'Save Customisation';
  }, 2000);

  jokePopup.classList.add('hide-popup');
  popupBackdrop.classList.add('hide-popup');

  // console.log(url)
  // console.log(jokeConfig);
}

function resetJokeCustomisation() {
  localStorage.removeItem('jokeConfig');
  localStorage.removeItem('url');

  jokeConfig.categories = ['Any'];
  jokeConfig.blacklistFlags = [];
  jokeConfig.type = 'single';
  jokeConfig.amount = 1;
  jokeConfig.searchById.isAllowed = false;
  jokeConfig.searchById.searchId = '';
  jokeConfig.searchByKeyword.isAllowed = false;
  jokeConfig.searchByKeyword.searchKeyword = '';
  url = 'https://v2.jokeapi.dev/joke/Any?type=single&amount=1';

  applySavedJokeConfigs();

  if (resetJokeTimeoutId) {
    clearTimeout(resetJokeTimeoutId);
  }

  resetJokeCustomisationButton.innerHTML = 'Customisation Reset';

  resetJokeTimeoutId = setTimeout(() => {
    resetJokeCustomisationButton.innerHTML = 'Reset Customisation';
  }, 2000);
}

function applySavedJokeConfigs() {
  if (jokeConfig.categories.includes('Any')) {
    anyJokeRadio.checked = true;
    toggleJokeCustomCategories(false);
  } else {
    customJokeRadio.checked = true;
    toggleJokeCustomCategories(true);

    customCategoriesCheckboxes.forEach(checkbox => {
      checkbox.checked = jokeConfig.categories.includes(checkbox.value);
    });
  }

  if (jokeConfig.type === 'single') {
    singleTypeRadio.checked = true;
    amountInput.disabled = false;
  } else if (jokeConfig.type === 'twopart') {
    twopartTypeRadio.checked = true;
    amountInput.disabled = true;
  }

  if (jokeConfig.blacklistFlags.length > 0) {
    blacklistFlags.forEach(flag => {
      flag.checked = jokeConfig.blacklistFlags.includes(flag.value);
    });
  } else {
    blacklistFlags.forEach(flag => {
      flag.checked = false;
    });
  }

  amountInput.value = jokeConfig.amount;

  if (jokeConfig.searchById.isAllowed) {
    allowJokeIdSearchCheckbox.checked = true;
    jokeIdInput.disabled = false;
    jokeIdInput.value = jokeConfig.searchById.searchId;
  } else {
    allowJokeIdSearchCheckbox.checked = false;
    jokeIdInput.disabled = true;
    jokeIdInput.value = '';
  }

  if (jokeConfig.searchByKeyword.isAllowed) {
    allowJokeKeywordSearchCheckbox.checked = true;
    jokeKeywordInput.disabled = false;
    jokeKeywordInput.value = jokeConfig.searchByKeyword.searchKeyword;
  } else {
    allowJokeKeywordSearchCheckbox.checked = false;
    jokeKeywordInput.disabled = true;
    jokeKeywordInput.value = '';
  }
}

applySavedJokeConfigs();

async function getJoke() {
  const response = await fetch(url);

  const responseData = await response.json();
  // console.log(responseData);

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

tellAJokeButton.addEventListener('click', () => {
  // console.log(url);

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  banner.classList.add('hide');

  tellAJokeButton.disabled = true;
  giveAdviceButton.disabled = true;

  contentContainer.innerHTML = 'Loading joke...';
  renderJoke();
});

export async function renderJoke() {
  try {
    let html = '';

    if (jokeConfig.type === 'single') {
      html = await generateSingleJokeHTML();
    } else if (jokeConfig.type === 'twopart') {
      html = await generateTwopartJokeHTML();
    }

    contentContainer.innerHTML = html;

    const copyButtons = document.querySelectorAll('.js-copy');

    const punchlineLink = document.querySelector('.js-punchline-link');
    const jokeDeliveryContainer = document.querySelector('.js-twopart-joke-delivery');

    if (punchlineLink && jokeDeliveryContainer) {
      copyButtons[0].disabled = true;
      
      const fallbackTimeoutId = setTimeout(() => {
        showPunchline();
        copyButtons[0].disabled = false;
      }, 60000);

      punchlineLink.addEventListener('click', () => {
        clearTimeout(fallbackTimeoutId);

        punchlineLink.classList.add('hide');

        setTimeout(() => {
          jokeDeliveryContainer.classList.remove('hide');
          copyButtons[0].disabled = false;
        }, 1000);
      });

      function showPunchline() {
        punchlineLink.classList.add('hide');
        jokeDeliveryContainer.classList.remove('hide');
      }
    }

    const jokeNumbers = document.querySelectorAll('.js-joke-number');

    if (jokeNumbers.length === 1) {
      jokeNumbers[0].classList.add('hide');
    }

    copyButtons.forEach(copyButton => {
      copyButton.addEventListener('click', async () =>  {
        const { jokeIndex } = copyButton.dataset
        // console.log(jokeIndex)

        const jokeElements = document.querySelectorAll(`.js-joke-${jokeIndex}`);
        // console.log(jokeElements)

        const textArray = Array.from(jokeElements, element => element.innerText);
        const text = textArray.join(', ');
        // console.log(text)

        await copyToClipboard(text, jokeIndex);
      });
    });

    timeoutId = setTimeout(() => {
      tellAJokeButton.disabled = false;
      giveAdviceButton.disabled = false;
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

async function generateSingleJokeHTML() {
  const response = await getJoke();

  if (response.error) {
    const errorHTML = generateErrorHTML(response);
    return errorHTML;
  }

  let jokeDetails = [];

  if (jokeConfig.amount === 1) {
    jokeDetails.push(response);
  } else if (jokeConfig.amount > 1) {
    const jokes = response.jokes
    jokes.forEach(joke => {
      jokeDetails.push(joke);
    });
  }

  // console.log(jokeConfig.amount)
  // console.log('joke details: ', jokeDetails);

  let jokeHTML = '';

  jokeDetails.forEach((joke, jokeIndex) => {
    jokeHTML += `
      <div class="joke-content joke-${jokeIndex}">
        <div class="joke-number js-joke-number">
          ${jokeIndex + 1}
        </div>
      
        <div>
          <button class="copy js-copy js-copy-${jokeIndex}" title="Copy Joke" data-joke-index=${jokeIndex}>
            <i class="fa-regular fa-copy copy-hover"></i>
            <i class="fa-solid fa-copy copy-active"></i>
          </button>
        </div>

        <div class="info">
          <div>
            Category: ${joke.category}
            |
            Safe: ${joke.safe ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}
          </div>

          <div>
            Joke: #${joke.id}
            |
            Type: ${joke.type}
          </div>
        </div>

        <div class="disclaimer">
          <span>Disclaimer:</span>
          <span title="not safe for work">nsfw: ${joke.flags.nsfw ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
          <span>religious: ${joke.flags.religious ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
          <span>political: ${joke.flags.political ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
          <span>racist: ${joke.flags.racist ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
          <span>sexist: ${joke.flags.sexist ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
          <span>explicit: ${joke.flags.explicit ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
        </div>

        <div class="joke-advice-body js-joke js-joke-${jokeIndex}">
          ${joke.joke}
        </div>
      </div>
    `;
  });

  return jokeHTML;
}

async function generateTwopartJokeHTML() {
  const jokeDetails = await getJoke();

  if (jokeDetails.error) {
    const errorHTML = generateErrorHTML(jokeDetails);
    return errorHTML;
  }

  const jokeHTML = `
    <div class="joke-content joke-${jokeDetails.id}">
      <div>
        <button class="copy js-copy js-copy-${jokeDetails.id}" title="Copy Joke" data-joke-index=${jokeDetails.id}>
          <i class="fa-regular fa-copy copy-hover"></i>
          <i class="fa-solid fa-copy copy-active"></i>
        </button>
      </div>

      <div class="info">
        <div>
          Category: ${jokeDetails.category}
          |
          Safe: ${jokeDetails.safe ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}
        </div>

        <div>
          Joke: #${jokeDetails.id}
          |
          Type: ${jokeDetails.type}
        </div>
      </div>

      <div class="disclaimer">
        <span>Disclaimer:</span>
        <span title="not safe for work">nsfw: ${jokeDetails.flags.nsfw ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
        <span>religious: ${jokeDetails.flags.religious ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
        <span>political: ${jokeDetails.flags.political ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
        <span>racist: ${jokeDetails.flags.racist ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
        <span>sexist: ${jokeDetails.flags.sexist ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
        <span>explicit: ${jokeDetails.flags.explicit ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
      </div>

      <div class="joke-advice-body">
        <div class="js-twopart-joke-setup js-joke-${jokeDetails.id}">
          ${jokeDetails.setup}
        </div>

        <div class="joke-delivery-container">
          <div>
            <span class="punchline-link js-punchline-link">Show punchline</span>
          </div>

          <div class="twopart-joke-delivery js-twopart-joke-delivery js-joke-${jokeDetails.id} hide">
            ${jokeDetails.delivery}
          </div>
        </div>
      </div>
    </div>
  `;

  return jokeHTML;
}

function generateErrorHTML(errorDetails) {
  const errorHTML = `
    <div class="error-container">
      <i class="fa-solid fa-face-frown" style="color:#3b0000; font-size:50px"></i>

      <div class="error-message">
        ${errorDetails.message}!
      </div>

      <div class="error-additional-info">
        ${errorDetails.additionalInfo}
      </div>
    </div>
  `;

  return errorHTML;
}