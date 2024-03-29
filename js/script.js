'use strict';

const previewCardsElem = document.querySelector('.preview-cards');
const previewCardsElems = previewCardsElem.querySelectorAll('.preview-card');
const modalsIds = [...previewCardsElems]
  .filter(previewCard => {
    return previewCard.querySelector('.preview-card__wraplink').hash;
  })
  .map(previewCard => {
    return previewCard.querySelector('.preview-card__wraplink').hash;
  });
const modalsAmount = modalsIds.length;

let currentModalIndex = null;
let followingModalIndex = null;
let currentModalId = '';
let followingModalId = '';
let modalSlider = null;
let closeBtn = null;
let sliderPrevBtn = null;
let sliderNextBtn = null;
let sliderWrapper = null;
let sliderProgressPieces = null;
let slidesAmount = 0;
let currentSlideIndex = 0;


const historiesCarousel = document.querySelector('.histories-carousel');
const historiesCarouselWrapper = historiesCarousel.querySelector(
  '.histories-carousel__wrapper'
);
const numberSlides = historiesCarouselWrapper.children.length;
let x0 = null;
let i = 0;
let locked = true;
let width;
historiesCarousel.style.setProperty('--n', numberSlides);

previewCardsElem.addEventListener('click', onPreviewCardsElemClick);

function onPreviewCardsElemClick(evt) {
  const cardLink = evt.target.closest('.preview-card__wraplink');

  if (!cardLink) {
    return;
  }

  evt.preventDefault();

  currentModalId = cardLink.hash;

  openHistoriesCarousel(currentModalId);
}

function isModalOpened(modalId) {
  const modalSlider = document.querySelector(modalId);

  // return !modalSlider.hidden;
}

function openHistoriesCarousel(modalId) {
  console.log('openHistoriesCarousel');

  historiesCarousel.hidden = false;

  size();

  historiesCarousel.addEventListener('mousedown', lock, true);
  historiesCarousel.addEventListener('touchstart', lock, true);

  historiesCarousel.addEventListener(
    'touchmove',
    e => {
      e.preventDefault();
    },
    false
  );

  historiesCarousel.addEventListener('mouseup', move, true);
  historiesCarousel.addEventListener('touchend', move, true);

  openModalSlider(modalId);
}

function closeHistoriesCarousel() {
  historiesCarousel.hidden = true;

  closeModalSlider();
  resetCurrentIndexToCarousel();
}

function openModalSlider(modalId) {
  modalSlider = document.querySelector(modalId);
  closeBtn = modalSlider.querySelector('.modal-slider__close');
  sliderPrevBtn = modalSlider.querySelector('[data-slide-prev]');
  sliderNextBtn = modalSlider.querySelector('[data-slide-next]');
  sliderWrapper = modalSlider.querySelector('.modal-slider__wrapper');
  slidesAmount = sliderWrapper.querySelectorAll('.modal-slider__slides-item')
    .length;
  sliderProgressPieces = modalSlider.querySelectorAll(
    '.modal-slider-progress__piece'
  );
  currentModalId = modalId;
  currentModalIndex = getCurrentModalIndexById(modalId);
  currentSlideIndex = 0;

  setCurrentIndexToCarousel(currentModalIndex);

  // modalSlider.hidden = false;

  /*
   * Обернут в setTimeout, чтобы происходила плавная анимация перехода первой шкалы прогрессбара
   * при начальном открытии модалки, т.к. без задержки закрашивание происходит без анимации перхода.
   */
  setTimeout(() => {
    updateSliderProgress();
  }, 0);


  console.log('openModal', currentModalIndex, currentModalId);

  closeBtn.addEventListener('click', onCloseBtnClick);
  sliderPrevBtn.addEventListener('click', onSliderPrevBtnClick);
  sliderNextBtn.addEventListener('click', onSliderNextBtnClick);
}

function closeModalSlider() {
  resetSliderScrollPosition();
  resetSliderProgress();

  // modalSlider.hidden = true;

  closeBtn.removeEventListener('click', onCloseBtnClick);
  sliderPrevBtn.removeEventListener('click', onSliderPrevBtnClick);
  sliderNextBtn.removeEventListener('click', onSliderNextBtnClick);
  // mc.destroy();
}

function onCloseBtnClick(evt) {
  closeHistoriesCarousel();
  closeModalSlider();
}

function onSliderPrevBtnClick(evt) {
  evt.preventDefault();
  console.log('click prev');

  if (currentSlideIndex - 1 >= 0) {
    currentSlideIndex = currentSlideIndex - 1;
    updateSliderScrollPosition();
    updateSliderProgress();
  } else {
    goToPrevModal();
    historiesCarousel.style.setProperty('--f', 0.5);
  }
}

function onSliderNextBtnClick(evt) {
  evt.preventDefault();
  console.log('click next');

  if (currentSlideIndex + 1 < slidesAmount) {
    currentSlideIndex = currentSlideIndex + 1;
    updateSliderScrollPosition();
    updateSliderProgress();
  } else {
    goToNextModal();
    historiesCarousel.style.setProperty('--f', 0.5);
  }
}

function updateSliderScrollPosition() {
  const offsetX =
    (sliderWrapper.scrollWidth / slidesAmount) * currentSlideIndex;
  sliderWrapper.scrollTo(offsetX, 0);
}

function resetSliderScrollPosition() {
  sliderWrapper.scrollTo(0, 0);
}

function updateSliderProgress() {
  sliderProgressPieces.forEach((piece, index) => {
    if (index <= currentSlideIndex) {
      piece.classList.add('modal-slider-progress__piece--active');
    } else {
      piece.classList.remove('modal-slider-progress__piece--active');
    }
  });
}

function resetSliderProgress() {
  sliderProgressPieces.forEach(piece => {
    piece.classList.remove('modal-slider-progress__piece--active');
  });
}

function getCurrentModalIndexById(modalId) {
  return modalsIds.indexOf(modalId);
}

function goToPrevModal() {
  const hasFollowingModalIndex = currentModalIndex - 1 >= 0;

  if (hasFollowingModalIndex) {
    followingModalIndex = currentModalIndex - 1;
  }

  followingModalId = modalsIds[followingModalIndex];

  closeModalSlider();

  if (hasFollowingModalIndex) {
    openModalSlider(followingModalId);
    // setCurrentIndexToCarousel(followingModalIndex);
  } else {
    closeHistoriesCarousel();
    console.warn('Закрываемся, дальше пустота.');
  }
}

function goToNextModal() {
  const hasFollowingModalIndex = currentModalIndex + 1 < modalsAmount;

  if (hasFollowingModalIndex) {
    followingModalIndex = currentModalIndex + 1;
  }

  followingModalId = modalsIds[followingModalIndex];

  closeModalSlider();

  if (hasFollowingModalIndex) {
    openModalSlider(followingModalId);
    // setCurrentIndexToCarousel(followingModalIndex);
    // historiesCarousel.classList.add('histories-carousel--smooth');
  } else {
    closeHistoriesCarousel();
    console.warn('Закрываемся, дальше пустота.');
  }
}

// carousel

function setCurrentIndexToCarousel(index) {
  historiesCarousel.style.setProperty('--i', index);
}

function resetCurrentIndexToCarousel() {
  historiesCarousel.style.removeProperty('--i');
}

function size() {
  width = window.innerWidth;
}

function unify(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}

function lock(e) {
  x0 = unify(e).clientX;
  historiesCarousel.classList.toggle(
    'histories-carousel--smooth',
    !(locked = true)
  );

  locked = true;

  historiesCarousel.addEventListener('mousemove', drag, true);
  historiesCarousel.addEventListener('touchmove', drag, true);
}

function drag(e) {
  e.preventDefault();

  if (locked) {
    historiesCarousel.style.setProperty(
      '--tx',
      `${Math.round(unify(e).clientX - x0)}px`
    );
  }
}

function move(e) {
  if (locked) {
    let dx = unify(e).clientX - x0;
    let sign = Math.sign(dx);
    let f = +((sign * dx) / width).toFixed(2);

    if ((i > 0 || sign < 0) && (i < numberSlides - 1 || sign > 0) && f > 0.2) {
      historiesCarousel.style.setProperty('--i', (i -= sign));

      f = 1 - f;
    }

    historiesCarousel.style.setProperty('--tx', '0px');
    historiesCarousel.style.setProperty('--f', f);
    historiesCarousel.classList.toggle(
      'histories-carousel--smooth',
      !(locked = false)
    );

    if (dx > 0 && f > 0.2) {
      goToPrevModal();
    } else if (dx < 0 && f > 0.2) {
      goToNextModal();
    }

    x0 = null;
  }

  historiesCarousel.removeEventListener('mousemove', drag, false);
  historiesCarousel.removeEventListener('touchmove', drag, false);
}
