let globalOfflineSigner;
let globalAddress;
let currentChain; 
let globalBalance;


let carouselElement;
let carouselBall;
let counter = 0;

function carousel(isLeft) {
  const currentCounter = counter;

  if (isLeft) counter = counter - 1  < 0 ? carouselElement.length - counter - 1: counter - 1;
  else counter++;

  carouselElement[currentCounter % carouselElement.length].style.zIndex = 0;
  carouselElement[counter % carouselElement.length].style.zIndex = 500;

  carouselBall[currentCounter % carouselBall.length].style.backgroundColor = "#FFFFFF";
  carouselBall[counter % carouselBall.length].style.backgroundColor = "#C4CDF4";
};

window.addEventListener('load',  async() => {

  carouselElement = Array.from(document.querySelectorAll('.content-wrapper-info-body-wrapper-each'));
  carouselBall = Array.from(document.querySelectorAll('.content-wrapper-info-footer-each'));

  setInterval(() => {
    carousel(false);
  }, 400000);


  document.addEventListener('click', event => {

    if (event.target.closest('.content-wrapper-info-body-larrow')) {
      const isLeft = true;
      carousel(isLeft);
    }

    if (event.target.closest('.content-wrapper-info-body-rarrow')) {
      const isLeft = false;
      carousel(isLeft);
    }
  });
});
