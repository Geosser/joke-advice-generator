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
  } else {
    menuItems.classList.remove('open');
  }
});

openJokePopupLink.addEventListener('click', () => {
  closeJokePopup();
});

closeJokePopupButton.addEventListener('click', () => {
  closeJokePopup();
});

openAdvicePopupLink.addEventListener('click', () => {
  closeAdvicePopup();
});

closeAdvicePopupButton.addEventListener('click', () => {
  closeAdvicePopup()
});

function closeJokePopup() {
  menuItems.classList.remove('open');

  if (!advicePopup.classList.contains('hide-popup')) {
    advicePopup.classList.add('hide-popup');
  }

  if (jokePopup.classList.contains('hide-popup')) {
    jokePopup.classList.remove('hide-popup');
  } else {
    jokePopup.classList.add('hide-popup');
  }
}

function closeAdvicePopup() {
  menuItems.classList.remove('open');

  if (!jokePopup.classList.contains('hide-popup')) {
    jokePopup.classList.add('hide-popup')
  }
  
  if (advicePopup.classList.contains('hide-popup')) {
    advicePopup.classList.remove('hide-popup');
  } else {
    advicePopup.classList.add('hide-popup');
  }
}

async function getJoke() {
  const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
  
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