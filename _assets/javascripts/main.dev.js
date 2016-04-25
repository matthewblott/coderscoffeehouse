$(function () {
  $('#search-query').lunrSearch({
    results: '#search-results',
    entries: '.entries',
    template: '#search-results-template'
  });
});