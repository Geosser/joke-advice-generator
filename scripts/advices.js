import { copyToClipboard } from "./utils/copyToClipboard.js";
import { advicePopup } from "./utils/menu.js";

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
      <div><i class="fa-solid fa-face-frown"></i></div>
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