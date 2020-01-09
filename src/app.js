console.log('app.js is running...');

const movieData = {
  dataItem : []
}

const formSubmit = (e) => {
  e.preventDefault();
  const searchValue = e.target.elements.search.value;
  console.log(searchValue);
  fetch(`http://www.omdbapi.com/?s=${searchValue}&type=movie&apikey=14ed988b`)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      response.json().then(function(data) {
        data.Search.map(el => {
          const imdbId = el.imdbID;
          fetch(`http://www.omdbapi.com/?i=${imdbId}&apikey=14ed988b`)
          .then(
            function(response) {
              response.json().then((data) => {
                movieData.dataItem.push(data);
                render();                    
              });
            } 
          );
        });
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

console.log(movieData.dataItem);
render();
}

const appRoot = document.getElementById('root');

const render = () => {
  const template = (
    <div>
      <h1>Movie Search App</h1>
      <form onSubmit={formSubmit}>
        <input type="search" name="search"/>
        <button type="submit">Submit</button>
      </form>
      <section>
        {
          movieData.dataItem.map((el) => {
            return (
              <article key={el.imdbID}>
                <p>{el.Title}</p>
                <p>{el.Year}</p>
                <p>IMDB Rating: {el.Ratings[0].Value}</p>
                <img src={el.Poster} alt="poster"/>
              </article>
            )
          })
        }
      </section>
    </div>
  );

  ReactDOM.render(template,appRoot);    
}

render();
  