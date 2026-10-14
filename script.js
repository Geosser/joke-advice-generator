const menuButton = document.querySelector('.js-menu-button');
const menuItems = document.querySelector('.js-menu-items');

const openJokePopupLink = document.querySelector('.js-open-joke-popup');
const openAdvicePopupLink = document.querySelector('.js-open-advice-popup');

const jokePopup = document.querySelector('.js-joke-popup-card');
const advicePopup = document.querySelector('.js-advice-popup-card');

const closeJokePopupButton = document.querySelector('.js-close-joke-popup');
const closeAdvicePopupButton = document.querySelector('.js-close-advice-popup');

menuButton.addEventListener('click', () => {
  if (!menuItems.classList.contains('open')) {
    menuItems.classList.add('open');
    menuButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    menuItems.classList.remove('open');
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

openJokePopupLink.addEventListener('click', () => {
  openJokePopup();
});

closeJokePopupButton.addEventListener('click', () => {
  openJokePopup();
});

openAdvicePopupLink.addEventListener('click', () => {
  openAdvicePopup();
});

closeAdvicePopupButton.addEventListener('click', () => {
  openAdvicePopup()
});

function openJokePopup() {
  menuItems.classList.remove('open');
  menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';

  if (!advicePopup.classList.contains('hide-popup')) {
    advicePopup.classList.add('hide-popup');
  }

  if (jokePopup.classList.contains('hide-popup')) {
    jokePopup.classList.remove('hide-popup');
  } else {
    jokePopup.classList.add('hide-popup');
  }
}

function openAdvicePopup() {
  menuItems.classList.remove('open');
  menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';

  if (!jokePopup.classList.contains('hide-popup')) {
    jokePopup.classList.add('hide-popup')
  }
  
  if (advicePopup.classList.contains('hide-popup')) {
    advicePopup.classList.remove('hide-popup');
  } else {
    advicePopup.classList.add('hide-popup');
  }
}

let url = JSON.parse(localStorage.getItem('url')) || 'https://v2.jokeapi.dev/joke/Any?type=single&amount=1';

const jokeConfig = JSON.parse(localStorage.getItem('jokeConfig')) || {
  categories: ['Any'],
  blacklistFlags: [],
  type: 'single',
  amount: 1
}

const saveJokeCustomisationButton = document.querySelector('.js-save-joke-customisation');

const resetJokeCustomisationButton = document.querySelector('.js-reset-joke-customisation');

saveJokeCustomisationButton.addEventListener('click', () => {
  saveJokeCustomisation();
});

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
        }
      });
    });
});

anyJokeRadio.addEventListener('change', () => {
  toggleJokeCustomCategories(false);
  saveJokeCustomisationButton.disabled = false;
});

function toggleJokeCustomCategories(enable) {
  customCategoriesCheckboxes.forEach(category => {
    category.disabled = !enable;
    customCategoriesCheckboxes.forEach(category => {
      if (category.checked) {
        category.checked = false;
      }
    });
  });
}

const singleTypeRadio = document.querySelector('.js-single-type-radio');
const twopartTypeRadio = document.querySelector('.js-twopart-type-radio');

const blacklistFlags = document.querySelectorAll('.js-custom-blacklist input[type="checkbox"]');

const amountInput = document.querySelector('.js-joke-amount');

let saveJokeTimeoutId;
let resetJokeTimeoutId;

function saveJokeCustomisation() {
  if (saveJokeTimeoutId) {
    clearTimeout(saveJokeTimeoutId);
  }
  
  saveJokeCustomisationButton.innerHTML = 'Customisation Saved';

  saveJokeTimeoutId = setTimeout(() => {
    saveJokeCustomisationButton.innerHTML = 'Save Customisation';
  }, 2000);

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

  jokeConfig.amount = Number(amountInput.value) || 1;

  url = `https://v2.jokeapi.dev/joke/${jokeConfig.categories.join(',')}?type=${jokeConfig.type}&blacklistFlags=${jokeConfig.blacklistFlags.join(',')}&amount=${jokeConfig.amount}`;

  localStorage.setItem('url', JSON.stringify(url));
  localStorage.setItem('jokeConfig', JSON.stringify(jokeConfig));

  applySavedJokeConfigs();

  // jokePopup.classList.add('hide-popup');

  console.log(url)
  console.log(jokeConfig);
}

function resetJokeCustomisation() {
  localStorage.removeItem('jokeConfig');
  localStorage.removeItem('url');

  jokeConfig.categories = ['Any'];
  jokeConfig.blacklistFlags = [];
  jokeConfig.type = 'single';
  jokeConfig.amount = 1;
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
  } else if (jokeConfig.type === 'twopart') {
    twopartTypeRadio.checked = true;
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
}

applySavedJokeConfigs();

async function getJoke() {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Server Error. Response Status: ${response.status}`);
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

async function getAdvice() {
  const response = await fetch('https://api.adviceslip.com/advice');
  
  if (!response.ok) {
    throw new Error(`Server Error. Response Status: ${response.status}`);
  }

  const responseData = await response.json();
  console.log(responseData);
  return responseData;
}

let timeoutId;

const contentContainer = document.querySelector('.js-joke-advice-container');
const banner = document.querySelector('.js-banner');

const tellAJokeButton = document.querySelector('.js-tell-a-joke');

tellAJokeButton.addEventListener('click', () => {
  console.log(url);

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  banner.classList.add('hide');

  tellAJokeButton.disabled = true;
  giveAdviceButton.disabled = true;

  contentContainer.innerHTML = 'Loading joke...';
  renderJoke();
});

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

async function renderJoke() {
  try {
    const html = await tellAJoke();

    contentContainer.innerHTML = html;

    const jokeNumbers = document.querySelectorAll('.js-joke-number');

    if (jokeNumbers.length === 1) {
      jokeNumbers[0].classList.add('hide');
    }

    const copyButtons = document.querySelectorAll('.js-copy');

    copyButtons.forEach(copyButton => {
      copyButton.addEventListener('click', async () =>  {
        const { jokeIndex } = copyButton.dataset
        const text = document.querySelector(`.js-joke-${jokeIndex}`).innerText;
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

    banner.innerHTML = `
      <div>
        <i class="fa-solid fa-xmark not-safe"></i>
        ${error}. Please try again later.
      </div>
    `;

    contentContainer.innerHTML = `
      <div><i class="fa-solid fa-face-frown"></i></div>
    `;

    timeoutId = setTimeout(() => {
      giveAdviceButton.disabled = false;
      tellAJokeButton.disabled = false;
    }, 2000);
  }
}

async function renderAdvice() {
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

    banner.innerHTML = `
      <div>
        <i class="fa-solid fa-xmark not-safe"></i>
        ${error}. Please try again later.
      </div>
    `;

    contentContainer.innerHTML = `
      <div><i class="fa-solid fa-face-frown"></i></div>
    `;

    timeoutId = setTimeout(() => {
      giveAdviceButton.disabled = false;
      tellAJokeButton.disabled = false;
    }, 2000);
  }
}

async function tellAJoke() {
  const response = await getJoke();
  console.log(response)

  let jokeDetails = [];

  if (jokeConfig.amount === 1) {
    jokeDetails.push(response);
  } else if (jokeConfig.amount > 1) {
    const jokes = response.jokes
    jokes.forEach(joke => {
      jokeDetails.push(joke);
    });
  }

  console.log(jokeConfig.amount)
  console.log('joke details: ', jokeDetails);

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

async function giveAdvice() {
  const adviceSlip = await getAdvice();
  const advice = adviceSlip.slip;

  const adviceHTML = `
    <div>
      <button class="copy js-copy" title="Copy Advice">
        <i class="fa-regular fa-copy copy-hover"></i>
        <i class="fa-solid fa-copy copy-active"></i>
      </button>
    </div>

    <div class="info">Advice #${advice.id}</div>

    <div class="joke-advice-body js-advice">
      ${advice.advice}
    </div>
  `;

  return adviceHTML;
}

let copyTimeoutId = {};

async function copyToClipboard(text, jokeIndex) {
  try {
    if (copyTimeoutId[jokeIndex]) {
      clearTimeout(copyTimeoutId[jokeIndex]);
    }

    await navigator.clipboard.writeText(text);

    const copyButton = document.querySelector(`.js-copy-${jokeIndex}`);

    copyButton.innerHTML = `<i class="fa-solid fa-check copied"></i>`;

    copyTimeoutId[jokeIndex] = setTimeout(() => {
      copyButton.innerHTML = `
        <i class="fa-regular fa-copy copy-hover"></i>
        <i class="fa-solid fa-copy copy-active"></i>
      `;
      // copyButton.disabled = false;

      banner.classList.add('hide');
    }, 2000);

  } catch (error) {
    banner.classList.remove('hide');

    banner.innerHTML = `
      <div>
        <i class="fa-solid fa-xmark not-safe"></i>
        Failed to copy. Please copy manually.
      </div>
    `;
  }
}