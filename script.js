//TMDB 

const API_KEY = 'api_key=c762b15b3425d7e3cc2462124dec3461';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&language=es-ES&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?language=es-ES&' + API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Acción"
    },
    {
      "id": 12,
      "name": "Aventura"
    },
    {
      "id": 16,
      "name": "Animación"
    },
    {
      "id": 35,
      "name": "Comedia"
    },
    {
      "id": 80,
      "name": "Crimen"
    },
    {
      "id": 99,
      "name": "Documental"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Familia"
    },
    {
      "id": 14,
      "name": "Fantasía"
    },
    {
      "id": 36,
      "name": "Historia"
    },
    {
      "id": 27,
      "name": "Terror"
    },
    {
      "id": 10402,
      "name": "Música"
    },
    {
      "id": 9648,
      "name": "Misterio"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Ciencia ficción"
    },
    {
      "id": 10770,
      "name": "Película de TV"
    },
    {
      "id": 53,
      "name": "Suspense"
    },
    {
      "id": 10752,
      "name": "Bélica"
    },
    {
      "id": 37,
      "name": "Western"
    }
];

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = [];
setGenre();

function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }
}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Limpiar ×';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
}

getMovies(API_URL);

function getMovies(url) {
    lastUrl = url;
    if (!url.includes('language=')) {
        url += '&language=es-ES';
    }
    
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})
        }else{
            main.innerHTML= `<h1 class="no-results">No Se Encontraron Resultados</h1>`
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "https://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>Sinopsis</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Ver Más</button
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
    })
}

const overlayContent = document.getElementById('overlay-content');

function openNav(movie) {
  let id = movie.id;
  
  fetch(BASE_URL + '/movie/'+id+'?'+API_KEY+'&language=es-ES')
    .then(res => res.json())
    .then(movieData => {
      fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY)
        .then(res => res.json())
        .then(videoData => {
          if(videoData){
            document.getElementById("myNav").style.width = "100%";
            
            const releaseDate = new Date(movieData.release_date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            let movieContent = `
              <h1 class="no-results">${movieData.title}</h1>
              <div class="movie-details">
                <h3>Sinopsis</h3>
                ${movieData.overview}
                <p><strong>Fecha de estreno:</strong> ${releaseDate}</p>
                <p><strong>Duración:</strong> ${movieData.runtime} minutos</p>
                <p><strong>Valoración:</strong> ${movieData.vote_average.toFixed(1)}/10</p>
                <p><strong>Géneros:</strong> ${movieData.genres.map(genre => genre.name).join(', ')}</p>
              </div>
            `;

            if(videoData.results.length > 0) {
              var embed = [];
              var filteredVideos = videoData.results
                .filter(video => video.site === 'YouTube')
                .slice(0, 5);

              filteredVideos.forEach((video, idx) => {
                let {name, key} = video;
                embed.push(`
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" 
                    title="${name}" class="embed hide" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen></iframe>
                `)
              })
              
              movieContent += `
                <div class="video-container">
                    <div class="video-wrapper">
                        ${embed.join('')}
                    </div>
                    <div class="video-nav">
                        <div class="video-counter">${activeSlide + 1}/${filteredVideos.length}</div>
                        <div class="progress-bar">
                            <div class="progress"></div>
                        </div>
                    </div>
                </div>
              `
            }
            
            overlayContent.innerHTML = movieContent;
            activeSlide = 0;
            showVideos();

            const leftArrow = document.getElementById('left-arrow');
            const rightArrow = document.getElementById('right-arrow');
            if(leftArrow) leftArrow.removeEventListener('click', navigateLeft);
            if(rightArrow) rightArrow.removeEventListener('click', navigateRight);

            if(leftArrow) leftArrow.addEventListener('click', navigateLeft);
            if(rightArrow) rightArrow.addEventListener('click', navigateRight);

            const arrows = document.querySelectorAll('.arrow');
            arrows.forEach(arrow => {
                arrow.style.display = 'block';
            });
          }
        })
    })
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  const arrows = document.querySelectorAll('.arrow');
  arrows.forEach(arrow => {
      arrow.style.display = 'none';
  });
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let progressBar = document.querySelector('.progress');
  let counter = document.querySelector('.video-counter');

  totalVideos = embedClasses.length; 
  
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')
    } else {
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

  if(progressBar && counter) {
    progressBar.style.width = `${((activeSlide + 1) / totalVideos) * 100}%`;
    counter.textContent = `${activeSlide + 1}/${totalVideos}`;
  }
}

function navigateLeft() {
  if(activeSlide > 0){
    activeSlide--;
  } else {
    activeSlide = totalVideos - 1;
  }
  showVideos();
}

function navigateRight() {
  if(activeSlide < (totalVideos - 1)){
    activeSlide++;
  } else {
    activeSlide = 0;
  }
  showVideos();
}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }
})

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}

let currentRecommendedIndex = 0;
let recommendedMovies = [];

function getRecommendedMovies() {
  const recommendationsURL = BASE_URL + '/movie/top_rated?' + API_KEY + '&language=es-ES';
  fetch(recommendationsURL)
      .then(res => res.json())
      .then(data => {
          if (data.results.length !== 0) {
              recommendedMovies = data.results;
              showRecommendedMovie(currentRecommendedIndex);
              setInterval(() => {
                  currentRecommendedIndex = (currentRecommendedIndex + 1) % recommendedMovies.length;
                  showRecommendedMovie(currentRecommendedIndex);
              }, 9000); // Change movie every 9 seconds
          }
      });
}

function showRecommendedMovie(index) {
  const recommendedList = document.getElementById('recommended-list');
  recommendedList.innerHTML = '';

  const movie = recommendedMovies[index];
  const { title, poster_path } = movie;
  const movieEl = document.createElement('div');
  movieEl.classList.add('recommended-movie');
  movieEl.innerHTML = `
      <div class="movie-info">
          <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/1080x1580'}" alt="${title}" class="movie-image">
          <h3>${title}</h3>
      </div>
  `;
  recommendedList.appendChild(movieEl);

  movieEl.querySelector('.movie-image').addEventListener('click', () => {
      openNav(movie); // Call the function to open movie details
  });
}

// Call the function to fetch recommended movies
getRecommendedMovies();
