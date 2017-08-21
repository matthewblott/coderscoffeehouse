//= require libs/jquery-3.2.1
//= require libs/tether-1.3.2
//= require libs/popper
//= require libs/bootstrap
//= require libs/lunr-0.5.12.min
//= require libs/date.format-1.2.3
//= require libs/URI-1.12.1
//= require libs/jquery.lunr.search-0.0.1

$(function () {
  $('#search-query').lunrSearch({
    results: '#search-results',
    entries: '.entries',
    template: '#search-results-template'
  });
});