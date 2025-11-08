import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'jquery-nice-select/css/nice-select.css';

export const jqueryReady = (async () => {
  const jQuery = window.jQuery || window.$;
  if (!jQuery) {
    throw new Error('jQuery must be loaded before bootstrap.js');
  }
  window.$ = window.jQuery = jQuery;

  const [{ default: Isotope }, { default: jQueryBridget }] = await Promise.all([
    import('isotope-layout'),
    import('jquery-bridget'),
  ]);
  jQueryBridget('isotope', Isotope, jQuery);
  window.Isotope = Isotope;

  await Promise.all([
    import('bootstrap/dist/js/bootstrap.bundle'),
    import('owl.carousel/dist/owl.carousel'),
    import('jquery-nice-select'),
  ]);

  return { jQuery, Isotope };
})();
