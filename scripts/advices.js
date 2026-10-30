import { copyToClipboard } from "./utils/copyToClipboard.js";
import { advicePopup } from "./utils/menu.js";

let adviceURL = JSON.parse(localStorage.getItem('adviceURL')) || 'https://api.adviceslip.com/advice';

let adviceConfig = {}

const saveAdviceCustomisationButton = document.querySelector('.js-save-advice-customisation');

saveAdviceCustomisationButton.addEventListener('click', () => {
  console.log('advice customisation saved');
  saveAdviceCustomisation();
});

const randomAdviceRadio = document.querySelector('.js-random-advice-radio');

function saveAdviceCustomisation() {
  if (randomAdviceRadio.checked) {
    adviceConfig = {};
    adviceConfig.category = randomAdviceRadio.value;
  }

  const urlParams = new URLSearchParams();

  if (adviceConfig.category === 'random') {
    adviceURL = 'https://api.adviceslip.com/advice';
  }

  localStorage.setItem('adviceConfig', JSON.stringify(adviceConfig));
  localStorage.setItem('adviceURL', JSON.stringify(adviceURL));

  console.log(adviceConfig);
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