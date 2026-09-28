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

const jokeContainer = document.querySelector('.js-joke-advice-container');
const adviceContainer = document.querySelector('.js-joke-advice-container');

const tellAJokeButton = document.querySelector('.js-tell-a-joke');

tellAJokeButton.addEventListener('click', () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  tellAJokeButton.disabled = true;
  giveAdviceButton.disabled = true;

  jokeContainer.innerHTML = 'Loading joke...';
  renderJoke();
});

const giveAdviceButton = document.querySelector('.js-give-advice');

giveAdviceButton.addEventListener('click', () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  giveAdviceButton.disabled = true;
  tellAJokeButton.disabled = true;

  adviceContainer.innerHTML = 'Loading advice...';
  renderAdvice();
});

async function renderJoke() {
  try {
    const html = await tellAJoke();

    jokeContainer.innerHTML = html;

    timeoutId = setTimeout(() => {
      tellAJokeButton.disabled = false;
      giveAdviceButton.disabled = false;
    }, 2000);
  } catch (error) {
    console.error('Unexpected error occured', error);
    jokeContainer.innerHTML = `<div>${error}. Please try again later.</div>`;
    timeoutId = setTimeout(() => {
      giveAdviceButton.disabled = false;
      tellAJokeButton.disabled = false;
    }, 2000);
  }
}

async function renderAdvice() {
  try {
    const html = await giveAdvice();

    adviceContainer.innerHTML = html;

    timeoutId = setTimeout(() => {
      giveAdviceButton.disabled = false;
      tellAJokeButton.disabled = false;
    }, 2000);

  } catch (error) {
    console.error('Unexpected error occured', error);
    jokeContainer.innerHTML = `<div>${error}. Please try again later.</div>`;
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
      <button class="copy" title="Copy">
        <i class="fa-regular fa-copy copy-hover"></i>
        <i class="fa-solid fa-copy copy-active"></i>
        <i class="fa-solid fa-check copy-copied"></i>
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

    <div class="joke-advice-body">
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
      <button class="copy" title="Copy">
        <i class="fa-regular fa-copy copy-hover"></i>
        <i class="fa-solid fa-copy copy-active"></i>
        <i class="fa-solid fa-check copy-copied"></i>
      </button>
    </div>

    <div class="info">Advice #${advice.id}</div>

    <div class="joke-advice-body">
      ${advice.advice}
    </div>
  `;

  return adviceHTML;
}