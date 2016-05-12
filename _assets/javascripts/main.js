//= require libs/jquery-2.2.0
//= require libs/tether-1.3.2
//= require libs/bootstrap
//= require libs/lunr-0.4.5
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