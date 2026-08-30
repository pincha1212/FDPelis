// [MODIFICADO] Código refactorizado manteniendo funcionalidad original y adaptado a nuevos IDs/clases

// Constantes
const API_KEY = 'api_key=c762b15b3425d7e3cc2462124dec3461';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&language=es-ES&${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_URL = `${BASE_URL}/search/movie?language=es-ES&${API_KEY}`;

const genres = [
  { id: 28, name: 'Acción' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 99, name: 'Documental' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Familia' },
  { id: 14, name: 'Fantasía' },
  { id: 36, name: 'Historia' },
  { id: 27, name: 'Terror' },
  { id: 10402, name: 'Música' },
  { id: 9648, name: 'Misterio' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ciencia ficción' },
  { id: 10770, name: 'Película de TV' },
  { id: 53, name: 'Suspense' },
  { id: 10752, name: 'Bélica' },
  { id: 37, name: 'Western' }
];

// Elementos DOM
const main = document.getElementById('main');
const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const currentPageEl = document.getElementById('current');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const overlayContent = document.getElementById('overlay-content');
const overlay = document.getElementById('myNav');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
const recommendedList = document.getElementById('recommended-list');
const prevRecommendedBtn = document.getElementById('prev-recommended');
const nextRecommendedBtn = document.getElementById('next-recommended');

// Estado
let currentPage = 1;
let nextPage = 2;
let prevPage = 1;
let lastUrl = '';
let totalPages = 100;
let selectedGenre = [];
let activeSlide = 0;
let totalVideos = 0;
let currentRecommendedIndex = 0;
let recommendedMovies = [];

// Utilidades
function getColor(vote) {
  if (vote >= 8) return 'green';
  if (vote >= 5) return 'orange';
  return 'red';
}

function formatDate(dateString) {
  if (!dateString) return 'No disponible';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Gestión de géneros
function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const tag = document.createElement('div');
    tag.classList.add('tag');
    tag.id = genre.id;
    tag.innerText = genre.name;
    tag.addEventListener('click', () => toggleGenre(genre.id));
    tagsEl.appendChild(tag);
  });
  highlightSelection();
}

function toggleGenre(genreId) {
  const index = selectedGenre.indexOf(genreId);
  if (index === -1) {
    selectedGenre.push(genreId);
  } else {
    selectedGenre.splice(index, 1);
  }
  const genreParam = selectedGenre.length ? `&with_genres=${selectedGenre.join(',')}` : '';
  getMovies(API_URL + genreParam);
  highlightSelection();
}

function highlightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => tag.classList.remove('highlight'));
  clearButton();
  if (selectedGenre.length) {
    selectedGenre.forEach(id => {
      const highlightedTag = document.getElementById(id);
      if (highlightedTag) highlightedTag.classList.add('highlight');
    });
  }
}

function clearButton() {
  let clearBtn = document.getElementById('clear');
  if (selectedGenre.length === 0) {
    if (clearBtn) clearBtn.remove();
    return;
  }
  if (!clearBtn) {
    clearBtn = document.createElement('div');
    clearBtn.classList.add('tag', 'highlight');
    clearBtn.id = 'clear';
    clearBtn.innerText = 'Limpiar ×';
    clearBtn.addEventListener('click', () => {
      selectedGenre = [];
      setGenre();
      getMovies(API_URL);
    });
    tagsEl.appendChild(clearBtn);
  } else {
    clearBtn.classList.add('highlight');
  }
}

// Obtener y mostrar películas
async function getMovies(url) {
  lastUrl = url;
  if (!url.includes('language=')) {
    url += '&language=es-ES';
  }
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.length !== 0) {
      showMovies(data.results);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPages = data.total_pages;
      currentPageEl.innerText = currentPage;

      if (currentPage <= 1) {
        prevBtn.classList.add('disabled');
        nextBtn.classList.remove('disabled');
      } else if (currentPage >= totalPages) {
        prevBtn.classList.remove('disabled');
        nextBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
        nextBtn.classList.remove('disabled');
      }

      tagsEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      main.innerHTML = `<h1 class="no-results">No Se Encontraron Resultados</h1>`;
    }
  } catch (error) {
    console.error('Error al obtener películas:', error);
    main.innerHTML = `<h1 class="no-results">Error al cargar películas. Intente nuevamente.</h1>`;
  }
}

function showMovies(movies) {
  main.innerHTML = '';
  movies.forEach(movie => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/1080x1580'}" alt="${title}" loading="lazy">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average.toFixed(1)}</span>
      </div>
      <div class="overview">
        <h3>Sinopsis</h3>
        ${overview || 'Sin sinopsis disponible.'}
        <br/>
        <button class="know-more" data-id="${id}">Ver Más</button>
      </div>
    `;
    main.appendChild(movieEl);
    movieEl.querySelector('.know-more').addEventListener('click', () => openNav(movie));
  });
}

// Overlay de detalles
async function openNav(movie) {
  const id = movie.id;
  try {
    const [movieData, videoData] = await Promise.all([
      fetch(`${BASE_URL}/movie/${id}?${API_KEY}&language=es-ES`).then(res => res.json()),
      fetch(`${BASE_URL}/movie/${id}/videos?${API_KEY}`).then(res => res.json())
    ]);

    overlay.style.width = '100%';
    const releaseDate = formatDate(movieData.release_date);
    let movieContent = `
      <h1>${movieData.title}</h1>
      <div class="movie-details">
        <h3>Sinopsis</h3>
        ${movieData.overview || 'Sin sinopsis disponible.'}
        <p><strong>Fecha de estreno:</strong> ${releaseDate}</p>
        <p><strong>Duración:</strong> ${movieData.runtime ? movieData.runtime + ' minutos' : 'No disponible'}</p>
        <p><strong>Valoración:</strong> ${movieData.vote_average ? movieData.vote_average.toFixed(1) + '/10' : 'No disponible'}</p>
        <p><strong>Géneros:</strong> ${movieData.genres?.map(g => g.name).join(', ') || 'No disponible'}</p>
      </div>
    `;

    if (videoData.results && videoData.results.length > 0) {
      const filteredVideos = videoData.results.filter(video => video.site === 'YouTube').slice(0, 5);
      if (filteredVideos.length > 0) {
        const embedVideos = filteredVideos.map((video, idx) => `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" 
            title="${video.name}" class="embed ${idx === 0 ? 'show' : 'hide'}" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen></iframe>
        `).join('');
        movieContent += `
          <div class="video-container">
            <div class="video-wrapper">${embedVideos}</div>
            <div class="video-nav">
              <div class="video-counter">1/${filteredVideos.length}</div>
              <div class="progress-bar"><div class="progress" style="width: ${100 / filteredVideos.length}%"></div></div>
            </div>
          </div>
        `;
      }
    }

    overlayContent.innerHTML = movieContent;
    activeSlide = 0;
    totalVideos = document.querySelectorAll('.embed').length;
    showVideos();
    leftArrow.style.display = 'block';
    rightArrow.style.display = 'block';
    leftArrow.removeEventListener('click', navigateLeft);
    rightArrow.removeEventListener('click', navigateRight);
    leftArrow.addEventListener('click', navigateLeft);
    rightArrow.addEventListener('click', navigateRight);
  } catch (error) {
    console.error('Error al abrir detalles:', error);
  }
}

function closeNav() {
  overlay.style.width = '0%';
  leftArrow.style.display = 'none';
  rightArrow.style.display = 'none';
}

function showVideos() {
  const embedClasses = document.querySelectorAll('.embed');
  const progressBar = document.querySelector('.progress');
  const counter = document.querySelector('.video-counter');
  totalVideos = embedClasses.length;

  embedClasses.forEach((embed, idx) => {
    if (idx === activeSlide) {
      embed.classList.add('show');
      embed.classList.remove('hide');
    } else {
      embed.classList.add('hide');
      embed.classList.remove('show');
    }
  });

  if (progressBar) {
    progressBar.style.width = `${((activeSlide + 1) / totalVideos) * 100}%`;
  }
  if (counter) {
    counter.textContent = `${activeSlide + 1}/${totalVideos}`;
  }
}

function navigateLeft() {
  if (totalVideos === 0) return;
  activeSlide = (activeSlide - 1 + totalVideos) % totalVideos;
  showVideos();
}

function navigateRight() {
  if (totalVideos === 0) return;
  activeSlide = (activeSlide + 1) % totalVideos;
  showVideos();
}

// Carrusel de recomendadas
async function getRecommendedMovies() {
  const recommendationsURL = `${BASE_URL}/movie/top_rated?${API_KEY}&language=es-ES`;
  try {
    const res = await fetch(recommendationsURL);
    const data = await res.json();
    if (data.results.length !== 0) {
      recommendedMovies = data.results;
      currentRecommendedIndex = 0;
      showRecommendedMovie(currentRecommendedIndex);
    }
  } catch (error) {
    console.error('Error al obtener recomendadas:', error);
  }
}

function showRecommendedMovie(index) {
  if (!recommendedMovies.length) return;
  recommendedList.innerHTML = '';
  const movie = recommendedMovies[index];
  const { title, poster_path } = movie;
  const movieEl = document.createElement('div');
  movieEl.classList.add('recommended-movie');
  movieEl.innerHTML = `
    <img src="${poster_path ? IMG_URL + poster_path : 'https://via.placeholder.com/1080x1580'}" alt="${title}" class="movie-image">
    <h3>${title}</h3>
  `;
  movieEl.querySelector('.movie-image').addEventListener('click', () => openNav(movie));
  recommendedList.appendChild(movieEl);
}

function previousRecommended() {
  if (recommendedMovies.length === 0) return;
  currentRecommendedIndex = (currentRecommendedIndex - 1 + recommendedMovies.length) % recommendedMovies.length;
  showRecommendedMovie(currentRecommendedIndex);
}

function nextRecommended() {
  if (recommendedMovies.length === 0) return;
  currentRecommendedIndex = (currentRecommendedIndex + 1) % recommendedMovies.length;
  showRecommendedMovie(currentRecommendedIndex);
}

// Paginación
function pageCall(page) {
  if (page < 1 || page > totalPages) return;
  const url = new URL(lastUrl);
  url.searchParams.set('page', page);
  getMovies(url.toString());
}

// Eventos
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(`${SEARCH_URL}&query=${encodeURIComponent(searchTerm)}`);
  } else {
    getMovies(API_URL);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    pageCall(currentPage - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    pageCall(currentPage + 1);
  }
});

prevRecommendedBtn.addEventListener('click', previousRecommended);
nextRecommendedBtn.addEventListener('click', nextRecommended);

// Inicialización
setGenre();
getMovies(API_URL);
getRecommendedMovies();
