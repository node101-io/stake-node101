let carouselElement;
let carouselBall;
let counter = 0;
let stop = false;


function carousel(isLeft) {
  let currentCounter = counter;
  if (isLeft) counter = counter - 1  < 0 ? carouselElement.length - counter - 1: counter - 1;
  else counter++;
  
  carouselElement[currentCounter % carouselElement.length].style.zIndex = 0;
  carouselElement[currentCounter % carouselElement.length].style.opacity = 0;
  
  carouselElement[counter % carouselElement.length].style.zIndex = 500;
  carouselElement[counter % carouselElement.length].style.opacity = 1;

  carouselBall[currentCounter % carouselBall.length].style.backgroundColor = "#FFFFFF";
  carouselBall[counter % carouselBall.length].style.backgroundColor = "#C4CDF4";
};

window.addEventListener('load',  async() => {

  carouselElement = Array.from(document.querySelectorAll('.content-wrapper-info-body-wrapper-each'));
  carouselBall = Array.from(document.querySelectorAll('.content-wrapper-info-footer-each'));

  setInterval(() => {
      if (!stop) {
        carousel(false); 
      }
    }, 4000); 
      
  document.addEventListener('mouseover', event => {
      if (event.target.closest('.content-wrapper-info-body-wrapper-each')) {
        stop = true;
      }
  });
    
  document.addEventListener('mouseout', event => {
      if (event.target.closest('.content-wrapper-info-body-wrapper-each')) {
        stop = false;
      }
  }); 
      


  document.addEventListener('click', event => {

    if (event.target.closest('.content-wrapper-info-body-larrow')) {
      const isLeft = true;
      carousel(isLeft);
    }

    if (event.target.closest('.content-wrapper-info-body-rarrow')) {
      const isLeft = false;
      carousel(isLeft);
    }

    if (event.target.closest('.content-wrapper-info-footer-each')) {
      const currentCounter = counter;
      counter = carouselBall.indexOf(event.target.closest('.content-wrapper-info-footer-each'));

      carouselElement[currentCounter % carouselElement.length].style.zIndex = 0;
      carouselElement[counter % carouselElement.length].style.zIndex = 500;

      carouselBall[currentCounter % carouselBall.length].style.backgroundColor = "#FFFFFF";
      carouselBall[counter % carouselBall.length].style.backgroundColor = "#C4CDF4";
    }
  });
});
