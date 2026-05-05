/**
 * Main JavaScript for The Real Slim Shady application
 * Interfaces layer: Client-side enhancements and interactions
 */

// Application namespace
const SlimShadyApp = {
  init() {
    this.setupEventListeners()
    this.addInteractiveFeatures()
    this.loadPageSpecificFeatures()
  },

  setupEventListeners() {
    // Smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault()
        const target = document.querySelector(e.target.getAttribute('href'))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })

    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.artist-card, .song-item')
    cards.forEach(card => {
      card.addEventListener('mouseenter', this.handleCardHover)
      card.addEventListener('mouseleave', this.handleCardLeave)
    })

    // Keyboard navigation support
    document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this))
  },

  handleCardHover(e) {
    e.target.style.transform = 'translateY(-8px) scale(1.02)'
  },

  handleCardLeave(e) {
    e.target.style.transform = ''
  },

  handleKeyboardNavigation(e) {
    // Alt + H: Go to home
    if (e.altKey && e.key === 'h') {
      window.location.href = '/'
    }
    
    // Alt + A: Go to about
    if (e.altKey && e.key === 'a') {
      window.location.href = '/about'
    }
    
    // Escape: Go back (if not on home page)
    if (e.key === 'Escape' && window.location.pathname !== '/') {
      window.history.back()
    }
  },

  addInteractiveFeatures() {
    this.addSearchFilter()
    this.addSortingOptions()
    this.addStatsAnimations()
    this.addThemeToggle()
  },

  addSearchFilter() {
    // Add search functionality if on artists page
    const artistsGrid = document.querySelector('.artists-grid')
    if (artistsGrid) {
      const searchContainer = document.createElement('div')
      searchContainer.className = 'search-container'
      searchContainer.innerHTML = `
        <input type="text" id="artistSearch" placeholder="🔍 Search artists..." class="search-input">
        <div class="search-results-count"></div>
      `
      
      artistsGrid.parentNode.insertBefore(searchContainer, artistsGrid)
      
      const searchInput = document.getElementById('artistSearch')
      const resultsCount = document.querySelector('.search-results-count')
      
      searchInput.addEventListener('input', (e) => {
        this.filterArtists(e.target.value, resultsCount)
      })
    }
  },

  filterArtists(searchTerm, resultsCount) {
    const artistCards = document.querySelectorAll('.artist-card')
    const term = searchTerm.toLowerCase()
    let visibleCount = 0

    artistCards.forEach(card => {
      const artistName = card.querySelector('h2 a').textContent.toLowerCase()
      const genre = card.querySelector('.genre').textContent.toLowerCase()
      
      const isMatch = artistName.includes(term) || genre.includes(term)
      
      if (isMatch) {
        card.style.display = 'block'
        visibleCount++
      } else {
        card.style.display = 'none'
      }
    })

    resultsCount.textContent = searchTerm 
      ? `Found ${visibleCount} artist${visibleCount !== 1 ? 's' : ''}`
      : ''
  },

  addSortingOptions() {
    const songsSection = document.querySelector('.songs-section')
    if (songsSection) {
      const sortContainer = document.createElement('div')
      sortContainer.className = 'sort-container'
      sortContainer.innerHTML = `
        <label for="songSort">Sort by:</label>
        <select id="songSort" class="sort-select">
          <option value="recommended">Recommended Order</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="year">Release Year</option>
          <option value="duration">Duration</option>
        </select>
      `
      
      songsSection.querySelector('h2').after(sortContainer)
      
      const sortSelect = document.getElementById('songSort')
      sortSelect.addEventListener('change', (e) => {
        this.sortSongs(e.target.value)
      })
    }
  },

  sortSongs(sortBy) {
    const songsList = document.querySelector('.songs-list')
    const songs = Array.from(songsList.querySelectorAll('.song-item'))
    
    songs.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          const titleA = a.querySelector('h3').textContent
          const titleB = b.querySelector('h3').textContent
          return titleA.localeCompare(titleB)
          
        case 'year':
          const yearA = parseInt(a.querySelector('.album').textContent.match(/\((\d{4})\)/)?.[1] || 0)
          const yearB = parseInt(b.querySelector('.album').textContent.match(/\((\d{4})\)/)?.[1] || 0)
          return yearA - yearB
          
        case 'duration':
          const durationA = this.parseDuration(a.querySelector('.duration').textContent)
          const durationB = this.parseDuration(b.querySelector('.duration').textContent)
          return durationB - durationA // Descending order
          
        default:
          return 0 // Keep original order for 'recommended'
      }
    })
    
    // Re-append sorted songs
    songs.forEach(song => songsList.appendChild(song))
  },

  parseDuration(durationStr) {
    const [minutes, seconds] = durationStr.split(':').map(Number)
    return minutes * 60 + seconds
  },

  addStatsAnimations() {
    const statValues = document.querySelectorAll('.stat-value')
    
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStatValue(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)
    
    statValues.forEach(stat => observer.observe(stat))
  },

  animateStatValue(element) {
    const finalValue = element.textContent
    const isNumber = /^\d+$/.test(finalValue)
    
    if (isNumber) {
      const target = parseInt(finalValue)
      let current = 0
      const increment = target / 30 // 30 steps for animation
      const duration = 1000 // 1 second
      const stepTime = duration / 30
      
      element.textContent = '0'
      
      const counter = setInterval(() => {
        current += increment
        if (current >= target) {
          element.textContent = target
          clearInterval(counter)
        } else {
          element.textContent = Math.floor(current)
        }
      }, stepTime)
    } else {
      // For non-numeric values, just add a fade-in effect
      element.style.opacity = '0'
      element.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease'
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
      }, 100)
    }
  },

  addThemeToggle() {
    // Add theme toggle button to navigation
    const navLinks = document.querySelector('.nav-links')
    if (navLinks) {
      const themeToggle = document.createElement('button')
      themeToggle.className = 'theme-toggle'
      themeToggle.innerHTML = '🌙'
      themeToggle.title = 'Toggle theme'
      
      themeToggle.addEventListener('click', this.toggleTheme.bind(this))
      navLinks.appendChild(themeToggle)
      
      // Load saved theme preference
      this.loadThemePreference()
    }
  },

  toggleTheme() {
    const body = document.body
    const themeToggle = document.querySelector('.theme-toggle')
    
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme')
      themeToggle.innerHTML = '🌙'
      localStorage.setItem('theme', 'dark')
    } else {
      body.classList.add('light-theme')
      themeToggle.innerHTML = '☀️'
      localStorage.setItem('theme', 'light')
    }
  },

  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme')
    const themeToggle = document.querySelector('.theme-toggle')
    
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme')
      if (themeToggle) themeToggle.innerHTML = '☀️'
    }
  },

  loadPageSpecificFeatures() {
    // Add page-specific functionality
    const path = window.location.pathname
    
    if (path.startsWith('/artist/')) {
      this.initArtistPage()
    } else if (path === '/') {
      this.initHomePage()
    } else if (path === '/about') {
      this.initAboutPage()
    }
  },

  initArtistPage() {
    // Add play button simulation for songs
    const songItems = document.querySelectorAll('.song-item')
    songItems.forEach(song => {
      const playButton = document.createElement('button')
      playButton.className = 'play-button'
      playButton.innerHTML = '▶️'
      playButton.title = 'Play song (demo)'
      
      playButton.addEventListener('click', (e) => {
        e.stopPropagation()
        this.simulatePlaySong(song, playButton)
      })
      
      song.querySelector('.song-meta').appendChild(playButton)
    })
  },

  simulatePlaySong(songElement, playButton) {
    // Simulate playing a song
    const songTitle = songElement.querySelector('h3').textContent
    
    // Visual feedback
    songElement.style.backgroundColor = 'rgba(255, 107, 53, 0.2)'
    playButton.innerHTML = '⏸️'
    playButton.disabled = true
    
    // Show "Now Playing" indicator
    const nowPlaying = document.createElement('div')
    nowPlaying.className = 'now-playing'
    nowPlaying.textContent = '♪ Now Playing'
    songElement.appendChild(nowPlaying)
    
    // Reset after 3 seconds
    setTimeout(() => {
      songElement.style.backgroundColor = ''
      playButton.innerHTML = '▶️'
      playButton.disabled = false
      nowPlaying.remove()
    }, 3000)
    
    // Show notification
    this.showNotification(`Playing: ${songTitle}`)
  },

  initHomePage() {
    // Add "Quick Stats" feature
    this.addQuickStats()
  },

  addQuickStats() {
    const statsBar = document.querySelector('.stats-bar')
    if (statsBar) {
      // Add click handlers to stats for more info
      const statItems = statsBar.querySelectorAll('span')
      statItems.forEach(item => {
        item.style.cursor = 'pointer'
        item.addEventListener('click', () => {
          this.showStatDetails(item.textContent)
        })
      })
    }
  },

  showStatDetails(statText) {
    const message = statText.includes('Total Artists') 
      ? 'This shows the total number of artists in our database.'
      : 'Legendary artists have 10+ year careers, 20+ songs, and at least one classic hit.'
    
    this.showNotification(message)
  },

  initAboutPage() {
    // Add interactive architecture diagram
    const layerCards = document.querySelectorAll('.layer-card')
    layerCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        this.showLayerInfo(index)
      })
      
      // Add hover effect with delay
      card.style.cursor = 'pointer'
    })
  },

  showLayerInfo(layerIndex) {
    const layerInfo = [
      'Domain Layer: Contains all business rules, entities, and core logic. This layer has no dependencies on external systems.',
      'Application Layer: Orchestrates the domain objects to fulfill specific use cases. Defines the application\'s behavior.',
      'Infrastructure Layer: Implements the technical details like databases, external APIs, and frameworks.',
      'Interfaces Layer: Handles user interaction, HTTP requests, and presents data to users.'
    ]
    
    this.showNotification(layerInfo[layerIndex])
  },

  showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification')
    if (existing) existing.remove()
    
    // Create new notification
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100)
    
    // Hide after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }, 4000)
  },

  // Utility functions
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Additional CSS for JavaScript-added elements
const additionalCSS = `
<style>
.search-container {
  margin-bottom: 30px;
  text-align: center;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  background: var(--background-card);
  color: var(--text-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-results-count {
  margin-top: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.sort-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background: var(--background-card);
  color: var(--text-color);
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.2);
}

.play-button {
  background: var(--accent-color);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.play-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.play-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.now-playing {
  position: absolute;
  right: 20px;
  top: 20px;
  background: var(--success-color);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  animation: pulse 1s infinite;
}

.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: var(--background-card);
  border: 1px solid var(--accent-color);
  border-radius: 8px;
  padding: 15px 20px;
  color: var(--text-color);
  max-width: 300px;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.notification.show {
  transform: translateX(0);
}

.light-theme {
  --primary-color: #f8f9fa;
  --secondary-color: #e9ecef;
  --text-color: #212529;
  --text-muted: #6c757d;
  --background-dark: #ffffff;
  --background-card: #f8f9fa;
  --border-color: #dee2e6;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }
  
  .notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .sort-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
`

// Inject additional CSS
document.head.insertAdjacentHTML('beforeend', additionalCSS)

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SlimShadyApp.init())
} else {
  SlimShadyApp.init()
}