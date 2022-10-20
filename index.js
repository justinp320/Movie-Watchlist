let searchArr = []

async function searchMovie(search){
  const response = await fetch(`https://www.omdbapi.com/?apikey=e4a07c53&s=${search}`)
  const data = await response.json()
  if(data.Response == 'False'){
    document.getElementById('container').innerHTML =
    `<div class="initial-state">
        <p>Unable to find what you're looking<br> for. Please try another search.</p>
    </div>`
  }
  else{
  let searchResults = data.Search
  for (let title of searchResults){
    searchArr.push(title.imdbID)
  }
  showResults()
  }
}

async function showResults(){
  let resultsHtml = ''
  for (let id of searchArr){
    const response = await fetch(`https://www.omdbapi.com/?apikey=e4a07c53&i=${id}`)
    const data = await response.json()
    let plotHtml = `<p class="movie-plot-text">${data.Plot}</p>`
    if (data.Plot.length > 125){
      plotHtml = `<p class="movie-plot-text">${data.Plot.substring(0,125)}<span class = "read-more" >...<button data-show="${data.imdbID}" id="read-more-btn">Read more</button></span>
                  <span class="hidden-text">${data.Plot.substring(125, data.Plot.length)}<button data-hide="${data.imdbID}" id="read-less-btn">Read less</button></span>
                  </p>`
    }
    resultsHtml += `
    <div class="movie" id="${data.imdbID}">
        <img class="movie-poster" src="${data.Poster}">
        <div class="movie-details">
            <div class="movie-header">
                <h3 class="movie-title">${data.Title}</h3>
                <img src="images/star-icon.svg" class="star-icon">
                <p class="movie-rating">${data.imdbRating}</p>
            </div>
            <div class="movie-subheader">
                <p class="movie-runtime">${data.Runtime}</p>
                <p class="movie-genre">${data.Genre}</p>
                <button class="add-btn" id="add-btn" data-id="${data.imdbID}">
                    <img src="images/watchlist-icon.svg" id="add-btn" data-id="${data.imdbID}">Watchlist
                </button>
            </div>
            <div class="movie-plot">
                ${plotHtml}
            </div>
        </div>
    </div>`
  }
  document.getElementById('container').innerHTML = resultsHtml
  showRemoveButton()
}

document.addEventListener('click', function(e){
  if(e.target.id === 'submit-btn'){
    e.preventDefault()
    searchArr = []
    let search = document.getElementById('search').value
    searchMovie(search)
    document.getElementById('search').value = ''
    document.getElementById('search').placeholder = search
  }
   else if(e.target.id === 'add-btn'){
    document.getElementById(e.target.dataset.id).querySelector('#add-btn').innerHTML =
    `<img src="images/remove-icon.svg" id="remove-btn" data-id="${e.target.dataset.id}">Remove`
    document.getElementById(e.target.dataset.id).querySelector('#add-btn').id = 'remove-btn'
    localStorage.setItem(e.target.dataset.id, document.getElementById(e.target.dataset.id).outerHTML)
  }
  else if(e.target.id === 'remove-btn'){
    document.getElementById(e.target.dataset.id).querySelector('#remove-btn').innerHTML =
      `<img src="images/watchlist-icon.svg" id="add-btn" data-id="${e.target.dataset.id}">Watchlist`
    document.getElementById(e.target.dataset.id).querySelector('#remove-btn').id = 'add-btn'
    localStorage.removeItem(e.target.dataset.id)
    loadWatchlist()
  }
  else if(e.target.id === 'read-more-btn'){
    document.getElementById(e.target.dataset.show).querySelector('.read-more').classList.add("hide")
    document.getElementById(e.target.dataset.show).querySelector('#read-more-btn').classList.add("hide")
    document.getElementById(e.target.dataset.show).querySelector('.hidden-text').style.display = 'inline'
  }
  else if(e.target.id === 'read-less-btn'){
    document.getElementById(e.target.dataset.hide).querySelector('.read-more').classList.remove("hide")
    document.getElementById(e.target.dataset.hide).querySelector('#read-more-btn').classList.remove("hide")
    document.getElementById(e.target.dataset.hide).querySelector('.hidden-text').style.display = 'none'
  }
})

function loadWatchlist(){
  if(document.getElementById('watchlist')){
    if (Object.keys(localStorage).length > 0){
      let moviesHtml = ''
      const movies = Object.values(localStorage)
      for(let i=0; i<movies.length; i++){
        moviesHtml += movies[i]
      }
      document.getElementById('watchlist').innerHTML = moviesHtml
    }
    else{
      document.getElementById('watchlist').innerHTML =
      `<div class="initial-state">
          <p>Your watchlist is looking a little empty...</p>
          <a href="index.html"><button class="watchlist-nav">
          <img src="images/watchlist-icon.svg">Let's add some movies!
          </button></a>
      </div>`
    }
    }
  }
loadWatchlist()

function showRemoveButton(){
  const keys = Object.keys(localStorage)
  const onList = searchArr.filter(id => keys.includes(id))
  onList.forEach(id => {
    document.getElementById(id).querySelector('#add-btn').innerHTML =
      `<img src="images/remove-icon.svg" id="remove-btn" data-id="${id}">Remove`
      document.getElementById(id).querySelector('#add-btn').id = 'remove-btn'
  })
}
