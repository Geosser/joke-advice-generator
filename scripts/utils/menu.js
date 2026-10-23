const menuButton = document.querySelector('.js-menu-button');
const menuItems = document.querySelector('.js-menu-items');

const openJokePopupLink = document.querySelector('.js-open-joke-popup');
const openAdvicePopupLink = document.querySelector('.js-open-advice-popup');

export const jokePopup = document.querySelector('.js-joke-popup-card');
export const advicePopup = document.querySelector('.js-advice-popup-card');
export const popupBackdrop = document.querySelector('.js-popup-backdrop');

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

  const isOpening = jokePopup.classList.contains('hide-popup');
  if (isOpening) {
    popupBackdrop.classList.remove('hide-popup');
  } else {
    popupBackdrop.classList.add('hide-popup');
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

  const isOpening = advicePopup.classList.contains('hide-popup');
  if (isOpening) {
    popupBackdrop.classList.remove('hide-popup');
  } else {
    popupBackdrop.classList.add('hide-popup');
  }
  
  if (advicePopup.classList.contains('hide-popup')) {
    advicePopup.classList.remove('hide-popup');
  } else {
    advicePopup.classList.add('hide-popup');
  }
}

popupBackdrop.addEventListener('click', () => {
  jokePopup.classList.add('hide-popup');
  advicePopup.classList.add('hide-popup');
  popupBackdrop.classList.add('hide-popup');
});