let copyTimeoutId = {};
const banner = document.querySelector('.js-banner');
const bannerContentContainer = document.querySelector('.js-banner-content');

export async function copyToClipboard(text, jokeIndex) {
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

      banner.classList.add('hide');
    }, 4000);

  } catch (error) {
    banner.classList.remove('hide');

    bannerContentContainer.innerHTML = `
      <div>
        Failed to copy. Please copy manually.
      </div>
    `;
  }
}