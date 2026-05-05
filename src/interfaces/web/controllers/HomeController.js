/**
 * Home Controller - Main page controller
 * Interfaces layer: Handles HTTP requests and responses
 */
class HomeController {
  constructor(listAllArtistsUseCase, getArtistDetailsUseCase) {
    this.listAllArtistsUseCase = listAllArtistsUseCase
    this.getArtistDetailsUseCase = getArtistDetailsUseCase
  }

  async renderHomePage(req, res) {
    try {
      const artistsData = await this.listAllArtistsUseCase.execute()
      
      res.send(this.generateHTML({
        title: 'The Real Slim Shady - Music Collection',
        content: this.renderArtistsList(artistsData),
        activeNav: 'home'
      }))
    } catch (error) {
      res.status(500).send(this.generateErrorHTML(error.message))
    }
  }

  async renderArtistPage(req, res) {
    try {
      const artistId = req.params.id
      const artistData = await this.getArtistDetailsUseCase.execute({ artistId })
      
      res.send(this.generateHTML({
        title: `${artistData.artist.name} - The Real Slim Shady`,
        content: this.renderArtistDetails(artistData),
        activeNav: 'artist'
      }))
    } catch (error) {
      res.status(404).send(this.generateErrorHTML(error.message))
    }
  }

  renderArtistsList(data) {
    const artistCards = data.artists.map(artist => `
      <div class="artist-card ${artist.isLegendary ? 'legendary' : ''}">
        <div class="artist-info">
          <h2><a href="/artist/${artist.id}">${artist.name}</a></h2>
          <p class="genre">${artist.genre}</p>
          <p class="years">${artist.yearsActive[0]} - ${artist.yearsActive[1] || 'Present'}</p>
          ${artist.isLegendary ? '<span class="legendary-badge">🏆 Legendary</span>' : ''}
        </div>
        <div class="artist-stats">
          <span class="song-count">${artist.songCount} songs</span>
          <span class="career-length">${artist.careerLength} years</span>
        </div>
      </div>
    `).join('')

    return `
      <div class="hero-section">
        <h1>🎤 The Real Slim Shady</h1>
        <p class="hero-subtitle">Music Collection & Artist Database</p>
        <div class="stats-bar">
          <span>Total Artists: ${data.totalCount}</span>
          <span>Legendary Artists: ${data.legendaryCount}</span>
        </div>
      </div>
      
      <div class="artists-grid">
        ${artistCards}
      </div>
    `
  }

  renderArtistDetails(data) {
    const songsList = data.songs.map(song => `
      <div class="song-item ${song.isClassic ? 'classic' : ''}">
        <div class="song-info">
          <h3>${song.title}</h3>
          <p class="album">${song.album} (${song.releaseYear})</p>
          <span class="era-badge">${song.era}</span>
        </div>
        <div class="song-meta">
          <span class="duration">${song.formattedDuration}</span>
          ${song.isClassic ? '<span class="classic-badge">Classic</span>' : ''}
        </div>
      </div>
    `).join('')

    return `
      <div class="artist-header">
        <a href="/" class="back-link">← Back to Artists</a>
        <h1>${data.artist.name} ${data.isLegendary ? '🏆' : ''}</h1>
        <div class="artist-meta">
          <span class="genre">${data.artist.genre}</span>
          <span class="years">${data.artist.yearsActive[0]} - ${data.artist.yearsActive[1] || 'Present'}</span>
          <span class="career">${data.artist.careerLength} years active</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Songs</h3>
          <div class="stat-value">${data.totalSongs}</div>
        </div>
        <div class="stat-card">
          <h3>Classic Songs</h3>
          <div class="stat-value">${data.stats.classicSongs}</div>
        </div>
        <div class="stat-card">
          <h3>Average Year</h3>
          <div class="stat-value">${data.stats.averageYear}</div>
        </div>
        <div class="stat-card">
          <h3>Status</h3>
          <div class="stat-value">${data.isLegendary ? 'Legendary' : 'Active'}</div>
        </div>
      </div>

      <div class="songs-section">
        <h2>Songs (Recommended Order)</h2>
        <div class="songs-list">
          ${songsList}
        </div>
      </div>

      ${data.stats.longestSong ? `
        <div class="highlight-section">
          <h3>Longest Song</h3>
          <div class="song-highlight">
            <strong>${data.stats.longestSong.title}</strong>
            <span>${data.stats.longestSong.formattedDuration}</span>
          </div>
        </div>
      ` : ''}
    `
  }

  generateHTML({ title, content, activeNav }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <nav class="main-nav">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="/">🎤 The Real Slim Shady</a>
            </div>
            <div class="nav-links">
                <a href="/" class="${activeNav === 'home' ? 'active' : ''}">Home</a>
                <a href="/about" class="${activeNav === 'about' ? 'active' : ''}">About</a>
            </div>
        </div>
    </nav>

    <main class="main-content">
        ${content}
    </main>

    <footer class="main-footer">
        <p>&copy; 2024 The Real Slim Shady Project. Built with Clean Architecture.</p>
    </footer>

    <script src="/scripts/main.js"></script>
</body>
</html>
    `
  }

  generateErrorHTML(message) {
    return this.generateHTML({
      title: 'Error - The Real Slim Shady',
      content: `
        <div class="error-section">
          <h1>Oops! Something went wrong</h1>
          <p class="error-message">${message}</p>
          <a href="/" class="btn-primary">Go back home</a>
        </div>
      `,
      activeNav: ''
    })
  }
}

module.exports = HomeController