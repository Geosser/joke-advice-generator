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

let url = JSON.parse(localStorage.getItem('url')) || 'https://v2.jokeapi.dev/joke/Any?Single';

const jokeConfig = JSON.parse(localStorage.getItem('jokeConfig')) || {
  categories: ['Any'],
  blacklistFlags: [],
  type: 'Single',
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
    .addEventListener('change', (event) => {
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

  url = `https://v2.jokeapi.dev/joke/${jokeConfig.categories.join(',')}?type=${jokeConfig.type}&blacklistFlags=${jokeConfig.blacklistFlags.join(',')}`;

  localStorage.setItem('url', JSON.stringify(url));
  localStorage.setItem('jokeConfig', JSON.stringify(jokeConfig));

  console.log(url)
  console.log(jokeConfig);
}

function resetJokeCustomisation() {
  localStorage.removeItem('jokeConfig');
  localStorage.removeItem('url');

  jokeConfig.categories = ['Any'];
  jokeConfig.blacklistFlags = [];
  jokeConfig.type = 'Single';
  jokeConfig.amount = 1;

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

  if (jokeConfig.type === 'Single') {
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

    const copyButton = document.querySelector('.js-copy');
    copyButton.addEventListener('click', async () =>  {
      banner.classList.add('hide');
      const text = document.querySelector('.js-joke').innerText;
      await copyToClipboard(text);
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
  const joke = await getJoke();

  const jokeHTML = `
    <div>
      <button class="copy js-copy" title="Copy Joke">
        <i class="fa-regular fa-copy copy-hover"></i>
        <i class="fa-solid fa-copy copy-active"></i>
      </button>
    </div>

    <div class="info">Joke #${joke.id} | Category: ${joke.category}</div>

    <div class="disclaimer">
      <span>Disclaimer:</span>
      <span title="not safe for work">nsfw: ${joke.flags.nsfw ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
      <span>religious: ${joke.flags.religious ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
      <span>political: ${joke.flags.political ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
      <span>racist: ${joke.flags.racist ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
      <span>sexist: ${joke.flags.sexist ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
      <span>explicit: ${joke.flags.explicit ? '<i class="fa-solid fa-check safe"></i>' : '<i class="fa-solid fa-xmark not-safe"></i>'}</span>
    </div>

    <div class="joke-advice-body js-joke">
      ${joke.joke}
    </div>
  `;

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

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);

    const copyButton = document.querySelector('.js-copy');
    copyButton.disabled = true;

    copyButton.innerHTML = `<i class="fa-solid fa-check copied"></i>`;

    banner.classList.remove('hide');
    banner.innerHTML = `
      <div>
        <i class="fa-solid fa-check copied"></i>
        copied
      </div>
    `;

    setTimeout(() => {
      copyButton.innerHTML = `
        <i class="fa-regular fa-copy copy-hover"></i>
        <i class="fa-solid fa-copy copy-active"></i>
      `;
      copyButton.disabled = false;

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