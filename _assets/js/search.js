(function () {
  function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = ``;

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];
        
        appendString += `<li><a href="${item.url}"><h3>${item.title}</h3></a>`;
        appendString += `<p>${item.content.substring(0, 150)}...</p></li>`;

      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = `<li>No results found</li>`;
    }
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

    fetch('/index.json')
      .then(response => response.json())
      .then(data => {

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {

          this.field('id');
          this.field('title', { boost: 10 });
          this.field('author');
          this.field('categories');
          this.field('content');
          this.field('url');
          this.field('date');

          for (var key in data) { // Add the data to lunr

            var item = {
              'id': key,
              'title': data[key].title,
              'author': data[key].author,
              'categories': data[key].categories,
              'content': data[key].content,
              'url': data[key].url,
              'date': data[key].date
            };

            this.add(item);

          }

        });

        var results = idx.search(searchTerm); // Get lunr to perform a search
        
        displaySearchResults(results, data);

      });

  }

})();
