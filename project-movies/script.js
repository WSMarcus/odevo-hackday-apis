console.log("Script loaded")

// TMDB API - Get your free API key from https://www.themoviedb.org/settings/api
const API_KEY = "467c9f3906dc7ee030a80f265cb54084"
const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`

const moviesSection = document.getElementById("movies")
const modal = document.getElementById("movieModal")
const modalContent = document.getElementById("modalContent")
const closeBtn = document.querySelector(".close-btn")

const openMoodPickerBtn = document.getElementById("openMoodPickerBtn")
const moodDropdown = document.getElementById("mood-dropdown")
const moodResult = document.getElementById("mood-result")

let allMovies = []

const fetchMovies = () => {
  fetch(URL)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      allMovies = data.results || []
      displayMovies(allMovies)
    })
    .catch((error) => {
      console.error("Error fetching movies:", error)
    })
}

const toggleMoodDropdown = () => {
  moodDropdown.classList.toggle("hidden")
}

openMoodPickerBtn.addEventListener("click", toggleMoodDropdown)

const closeMoodDropdown = () => {
  moodDropdown.classList.add("hidden")
}

const moodSelectorButtons = document.querySelectorAll(".mood-option")

moodSelectorButtons.forEach(button => {
  button.addEventListener("click", () => {
    const mood = button.getAttribute("data-mood")
    const selectedClass = "selected"
    moodSelectorButtons.forEach(btn => btn.classList.remove(selectedClass))
    button.classList.add(selectedClass)

    const filteredMovies = allMovies.filter(movie => {
      return movie.genre_ids && movie.genre_ids.some(id => moodGenres[mood].includes(id))
    })

    if (filteredMovies.length > 0) {
      displayMovies(filteredMovies)
      showMoodResult(mood, filteredMovies)
    } else {
      moodResult.innerHTML = `<p>No movies found for mood '${mood}', showing all instead.</p>`
      displayMovies(allMovies)
    }

    closeMoodDropdown()
  })
})

const showMoodResult = (mood, filteredMovies) => {
  const moodText = mood.charAt(0).toUpperCase() + mood.slice(1)
  moodResult.classList.remove("hidden")
  moodResult.innerHTML = `
    <div class="mood-result-content">
      <p>Showing ${filteredMovies.length} movies for mood: <strong>${moodText}</strong></p>
      <button id="resetMoodFilter" class="reset-mood-filter">Reset filter</button>
    </div>
  `
  document.getElementById("resetMoodFilter").addEventListener("click", () => {
    moodResult.classList.add("hidden")
    moodSelectorButtons.forEach(btn => btn.classList.remove("selected"))
    displayMovies(allMovies)
  })
}


const fetchMovieDetails = (movieId) => {
  const detailsURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
  const similarURL = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`
  
  Promise.all([
    fetch(detailsURL).then(response => response.json()),
    fetch(similarURL).then(response => response.json())
  ])
    .then(([movieData, similarData]) => {
      console.log("Movie details:", movieData)
      console.log("Similar movies:", similarData)
      displayModal(movieData, similarData.results)
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error)
    })
}

const displayMovies = (movies) => {
  moviesSection.innerHTML = ""
  
  movies.forEach((movie) => {
    const movieCard = document.createElement("div")
    movieCard.className = "movie-card"
    
    const posterPath = movie.poster_path
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "https://via.placeholder.com/500x750?text=No+Image"
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    const releaseDate = movie.release_date || "N/A"
    const genres = movie.genre_ids ? movie.genre_ids.join(", ") : "N/A"
    
    movieCard.innerHTML = `
      <div class="movie-poster">
        <img src="${posterUrl}" alt="${movie.title}">
        <div class="movie-rating">${rating}</div>
      </div>
      <div class="movie-info">
        <h2 class="movie-title">${movie.title}</h2>
        <p class="movie-overview">${movie.overview || "No description available"}</p>
        <div class="movie-details">
          <p><strong>Release Date:</strong> ${releaseDate}</p>
          <p><strong>Category:</strong> ${genres}</p>
        </div>
      </div>
    `
    
    movieCard.addEventListener("click", () => {
      fetchMovieDetails(movie.id)
    })
    
    moviesSection.appendChild(movieCard)
  })
}

const displayModal = (movie, similarMovies = []) => {
  const backdropPath = movie.backdrop_path
  const backdropUrl = backdropPath ? `https://image.tmdb.org/t/p/w1280${backdropPath}` : "https://via.placeholder.com/1280x720?text=No+Backdrop"
  
  const posterPath = movie.poster_path
  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "https://via.placeholder.com/500x750?text=No+Image"
  
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
  const releaseDate = movie.release_date || "N/A"
  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A"
  const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"
  const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"
  const status = movie.status || "N/A"
  const tagline = movie.tagline || ""
  
  const cast = movie.credits && movie.credits.cast ? movie.credits.cast.slice(0, 5).map(actor => actor.name).join(", ") : "N/A"
  
  const genres = movie.genres ? movie.genres.map(g => g.name).join(", ") : "N/A"
  const companies = movie.production_companies ? movie.production_companies.slice(0, 3).map(c => c.name).join(", ") : "N/A"
  const languages = movie.spoken_languages ? movie.spoken_languages.map(l => l.english_name).join(", ") : "N/A"
  
  let similarMoviesHTML = ""
  if (similarMovies.length > 0) {
    similarMoviesHTML = `
      <div class="modal-section">
        <h3>Similar Movies</h3>
        <div class="similar-movies-grid">
          ${similarMovies.slice(0, 5).map(movie => {
            const simPosterPath = movie.poster_path
            const simPosterUrl = simPosterPath ? `https://image.tmdb.org/t/p/w300${simPosterPath}` : "https://via.placeholder.com/300x450?text=No+Image"
            const simRating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
            
            return `
              <div class="similar-movie-card">
                <img src="${simPosterUrl}" alt="${movie.title}">
                <div class="similar-movie-rating">${simRating}</div>
                <p class="similar-movie-title">${movie.title}</p>
              </div>
            `
          }).join("")}
        </div>
      </div>
    `
  }
  
  modalContent.innerHTML = `
    <div class="modal-header">
      <img src="${backdropUrl}" alt="${movie.title}" class="modal-backdrop">
      <h2>${movie.title}</h2>
      ${tagline ? `<p class="tagline">"${tagline}"</p>` : ""}
    </div>
    
    <div class="modal-body">
      <div class="modal-left">
        <img src="${posterUrl}" alt="${movie.title}" class="modal-poster">
      </div>
      
      <div class="modal-right">
        <div class="modal-section">
          <h3>Overview</h3>
          <p>${movie.overview || "No description available"}</p>
        </div>
        
        <div class="modal-section">
          <h3>Key Information</h3>
          <p><strong>Rating:</strong> ${rating} / 10</p>
          <p><strong>Release Date:</strong> ${releaseDate}</p>
          <p><strong>Runtime:</strong> ${runtime}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Genres:</strong> ${genres}</p>
        </div>
        
        <div class="modal-section">
          <h3>Cast</h3>
          <p>${cast}</p>
        </div>
        
        <div class="modal-section">
          <h3>Financial Information</h3>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Revenue:</strong> ${revenue}</p>
        </div>
        
        <div class="modal-section">
          <h3>Production Details</h3>
          <p><strong>Production Companies:</strong> ${companies}</p>
          <p><strong>Languages:</strong> ${languages}</p>
        </div>
        
        ${similarMoviesHTML}
      </div>
    </div>
  `
  
  modal.style.display = "block"
}

const closeModal = () => {
  modal.style.display = "none"
}

closeBtn.addEventListener("click", closeModal)

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal()
  }
})

// ===== MOOD PICKER FUNCTIONALITY =====

const moodGenres = {
  happy: [35, 10751], // Comedy, Family
  sad: [18, 10749], // Drama, Romance
  annoyed: [28, 53], // Action, Thriller
  neutral: [12, 16] // Adventure, Animation
}

const contrastingMoods = {
  happy: "sad",
  sad: "annoyed",
  annoyed: "happy",
  neutral: "happy"
}

let currentMood = null

const fetchMoodBasedMovie = (mood, isContrasting = false) => {
  const genreIds = isContrasting ? moodGenres[contrastingMoods[mood]] : moodGenres[mood]
  const genreString = genreIds.join("|")
  
  const moodMovieURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc&page=1`
  
  fetch(moodMovieURL)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        const randomMovie = data.results[Math.floor(Math.random() * Math.min(10, data.results.length))]
        displayMoodMovie(randomMovie, mood, isContrasting)
      }
    })
    .catch(error => console.error("Error fetching mood-based movie:", error))
}

const displayMoodMovie = (movie, mood, isContrasting) => {
  const posterPath = movie.poster_path
  const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "https://via.placeholder.com/500x750?text=No+Image"
  
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
  const releaseDate = movie.release_date || "N/A"
  
  const moodResult = document.getElementById("mood-result")
  const suggestedMovieDiv = document.querySelector(".mood-suggested-movie")
  
  let moodText = mood.charAt(0).toUpperCase() + mood.slice(1)
  let suggestionText = `Here's a ${moodText} movie for you:`
  
  if (isContrasting) {
    const contrastMood = contrastingMoods[mood].charAt(0).toUpperCase() + contrastingMoods[mood].slice(1)
    suggestionText = `Let's try something different! Here's a ${contrastMood} movie instead:`
  }
  
  suggestedMovieDiv.innerHTML = `
    <h3>${suggestionText}</h3>
    <div class="mood-movie-card">
      <img src="${posterUrl}" alt="${movie.title}">
      <div class="mood-movie-info">
        <h4>${movie.title}</h4>
        <p><strong>Rating:</strong> ${rating} / 10</p>
        <p><strong>Release Date:</strong> ${releaseDate}</p>
        <p class="mood-movie-overview">${movie.overview || "No description available"}</p>
      </div>
    </div>
  `
  
  moodResult.style.display = "block"
  
  // Remove old event listeners and add new ones
  document.querySelectorAll(".feedback-button").forEach(btn => {
    const newBtn = btn.cloneNode(true)
    btn.parentNode.replaceChild(newBtn, btn)
  })
  
  document.querySelector(".yes-button").addEventListener("click", () => {
    document.getElementById("mood-result").style.display = "none"
    document.querySelectorAll(".mood-button").forEach(btn => {
      btn.classList.remove("selected")
    })
  })
  
  document.querySelector(".change-button").addEventListener("click", () => {
    fetchMoodBasedMovie(mood, true)
  })
}

fetchMovies()
