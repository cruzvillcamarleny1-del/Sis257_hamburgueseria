import { jqueryReady } from './bootstrap';
import $ from 'jquery';

function getYear() {
  const target = document.getElementById('displayYear');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
}
getYear();

function myMap() {
  const mapHost = document.getElementById('googleMap');
  if (!mapHost || !window.google?.maps) return;

  const mapProp = {
    center: new window.google.maps.LatLng(40.712775, -74.005973),
    zoom: 18,
  };

  new window.google.maps.Map(mapHost, mapProp);
}
window.myMap = myMap;

await jqueryReady;

const initGrid = () => {
  if (typeof $.fn.isotope !== 'function') return;

  const $grid = $('.grid').isotope({
    itemSelector: '.all',
    percentPosition: false,
    masonry: { columnWidth: '.all' },
  });

  $('.filters_menu li').on('click', function () {
    $('.filters_menu li').removeClass('active');
    $(this).addClass('active');
    $grid.isotope({ filter: $(this).data('filter') });
  });
};

if (document.readyState === 'complete') {
  initGrid();
} else {
  window.addEventListener('load', initGrid, { once: true });
}

const initChoices = () => {
  if (typeof $.fn.niceSelect === 'function') {
    $('select').niceSelect();
  }

  if (typeof $.fn.owlCarousel === 'function') {
    const $carousel = $('.client_owl-carousel');
    if ($carousel.length) {
      $carousel.owlCarousel({
        loop: true,
        margin: 0,
        dots: false,
        nav: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
          '<i class="fa fa-angle-left" aria-hidden="true"></i>',
          '<i class="fa fa-angle-right" aria-hidden="true"></i>',
        ],
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
          1000: { items: 2 },
        },
      });
    }
  }
};

$(initChoices);
