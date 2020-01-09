'use strict';

console.log('app.js is running...');

var movieData = {
  dataItem: []
};

var formSubmit = function formSubmit(e) {
  e.preventDefault();
  var searchValue = e.target.elements.search.value;
  console.log(searchValue);
  fetch('http://www.omdbapi.com/?s=' + searchValue + '&type=movie&apikey=14ed988b').then(function (response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      return;
    }

    response.json().then(function (data) {
      data.Search.map(function (el) {
        var imdbId = el.imdbID;
        fetch('http://www.omdbapi.com/?i=' + imdbId + '&apikey=14ed988b').then(function (response) {
          response.json().then(function (data) {
            movieData.dataItem.push(data);
            render();
          });
        });
      });
    });
  }).catch(function (err) {
    console.log('Fetch Error :-S', err);
  });

  console.log(movieData.dataItem);
  render();
};

var appRoot = document.getElementById('root');

var render = function render() {
  var template = React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      null,
      'Movie Search App'
    ),
    React.createElement(
      'form',
      { onSubmit: formSubmit },
      React.createElement('input', { type: 'search', name: 'search' }),
      React.createElement(
        'button',
        { type: 'submit' },
        'Submit'
      )
    ),
    React.createElement(
      'section',
      null,
      movieData.dataItem.map(function (el) {
        return React.createElement(
          'article',
          { key: el.imdbID },
          React.createElement(
            'p',
            null,
            el.Title
          ),
          React.createElement(
            'p',
            null,
            el.Year
          ),
          React.createElement(
            'p',
            null,
            'IMDB Rating: ',
            el.Ratings[0].Value
          ),
          React.createElement('img', { src: el.Poster, alt: 'poster' })
        );
      })
    )
  );

  ReactDOM.render(template, appRoot);
};

render();
