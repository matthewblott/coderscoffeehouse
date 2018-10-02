
(() => {

  function getSearchResults(results, store) {

    var list = [];

    for (var i = 0; i < results.length; i++) {
      list.push(store[results[i].ref]);
    }

    return list;

  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('q');

  if (searchTerm) {

    fetch('/search_data.json')
      .then((response) => {
        return response.json();
      })
      .then((json) => {

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
          this.field('id');
          this.field('title', { boost: 10 });
          this.field('author');
          this.field('category');
          this.field('content');

          for (var key in json) {
            this.add({
              'id': key,
              'title': json[key].title,
              'author': json[key].author,
              'category': json[key].category,
              'content': json[key].content
            });
          }

        });

        var results = idx.search(searchTerm);
        var list = getSearchResults(results, json);
        var template = document.getElementById('sample_template').innerHTML;
        var output = Mustache.render(template, list);
        var newoutput = JSON.parse(JSON.stringify(output));

        document.getElementById('search-results').innerHTML = output;

      });

  }

})();
