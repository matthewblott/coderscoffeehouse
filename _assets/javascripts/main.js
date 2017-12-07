//= require libs/jquery-3.2.1
//= require libs/tether-1.3.2
//= require libs/popper
//= require libs/bootstrap
//= require libs/lunr-0.5.12.min
//= require libs/date.format-1.2.3
//= require libs/URI-1.12.1
//= require libs/jquery.lunr.search-0.0.1
//= require libs/cookieconsent.min

// github.com/insites/cookieconsent/

$(function () {
  $('#search-query').lunrSearch({
    results: '#search-results',
    entries: '.entries',
    template: '#search-results-template'
  });
});

window.addEventListener('load', function() {
  window.cookieconsent.initialise({
    'palette': {
    'popup': {
        'background': '#252e39'
      },
      'button': {
        'background': '#14a7d0'
      }
    },
    'theme': 'classic',
    'position': 'bottom-right'
  })});