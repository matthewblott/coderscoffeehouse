//= require vendor/jquery-2.1.4
//= require vendor/bootstrap
//= require vendor/lunr
//= require vendor/mustache
//= require vendor/date.format
//= require vendor/URI
//= require vendor/jquery.lunr.search

$(function () {
  $('#search-query').lunrSearch({
    results: '#search-results',
    entries: '.entries',
    template: '#search-results-template'
  });
});