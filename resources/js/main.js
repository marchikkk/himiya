/***********************
 * ВЕРХНЯЯ КАРУСЕЛЬ
 ***********************/
const myCarousel = document.querySelector('#carouselExampleControls');
if (myCarousel) {
  new bootstrap.Carousel(myCarousel, {
    interval: 3000,
    ride: 'carousel',
    wrap: true
  });
}

/***********************
 * НИЖНЯЯ КАРУСЕЛЬ
 ***********************/
new Swiper(".mySwiper", {
  // Настройки для самых маленьких экранов (мобилки)
  slidesPerView: 2,      // 2 карточки рядом
  slidesPerGroup: 1,
  spaceBetween: 10,     // Меньше отступ на мобилке
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  // Адаптив под разные экраны
  breakpoints: {
    // когда ширина экрана >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 15
    },
    // когда ширина экрана >= 1022px (твой порог мобилки)
    1022: {
      slidesPerView: 5,
      spaceBetween: 20
    }
  }
});

/***********************
 * ПРОКРУТКА КАРТОЧКИ ТОВАРА
 ***********************/
document.querySelectorAll('.itemSwiper').forEach(swiperEl => {
  const swiper = new Swiper(swiperEl, {
    navigation: {
      nextEl: swiperEl.querySelector('.swiper-button-next'),
      prevEl: swiperEl.querySelector('.swiper-button-prev'),
    },
    loop: true, //для прокрутки карточки товар 
  });

  swiperEl.addEventListener('mouseleave', () => {
    swiper.slideToLoop(0);
  });
});

// /***********************
//  * НИЖНИЙ КАТАЛОГ (catPush)
//  ***********************/
// const menuItems = document.querySelectorAll('#catPush .has-menu');
// const submenus = document.querySelector('.submenus');
// const catMenus = document.querySelectorAll('.submenus .cat-menu');
// const overlay = document.getElementById('overlay'); // <--- Добавь это

// menuItems.forEach((item, i) => {
//   item.addEventListener('mouseenter', () => {
//     submenus.classList.add('active');
//     if (overlay) overlay.classList.add('active'); // <--- И это
    
//     catMenus.forEach(c => c.classList.remove('active'));
//     catMenus[i]?.classList.add('active');
//   });
// });

// // Закрытие при уходе мышки
// document.querySelector('.catal-hover')?.addEventListener('mouseleave', () => {
//   submenus.classList.remove('active');
//   if (overlay) overlay.classList.remove('active'); // <--- И это
// });







