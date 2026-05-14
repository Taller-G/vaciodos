/**
 * Web Server Entry Point
 * Interfaces layer: Main application server configuration
 */
const express = require('express')
const path = require('path')
require('dotenv').config()

// Infrastructure implementations
const InMemoryArtistRepository = require('../../infrastructure/repositories/InMemoryArtistRepository')
const InMemorySongRepository = require('../../infrastructure/repositories/InMemorySongRepository')

// Domain services
const MusicService = require('../../domain/services/MusicService')

// Application use cases
const ListAllArtists = require('../../application/use-cases/ListAllArtists')
const GetArtistDetails = require('../../application/use-cases/GetArtistDetails')
const GetSongsByAlbum = require('../../application/use-cases/GetSongsByAlbum')

// Interface controllers
const HomeController = require('./controllers/HomeController')

class WebServer {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    
    this.initializeDependencies()
    this.configureMiddleware()
    this.setupRoutes()
    this.setupErrorHandling()
  }

  initializeDependencies() {
    // Infrastructure layer
    this.artistRepository = new InMemoryArtistRepository()
    this.songRepository = new InMemorySongRepository()
    
    // Domain services
    this.musicService = new MusicService()
    
    // Application use cases
    this.listAllArtistsUseCase = new ListAllArtists(
      this.artistRepository,
      this.songRepository,
      this.musicService
    )
    
    this.getArtistDetailsUseCase = new GetArtistDetails(
      this.artistRepository,
      this.songRepository,
      this.musicService
    )
    
    this.getSongsByAlbumUseCase = new GetSongsByAlbum(
      this.songRepository,
      this.artistRepository,
      this.musicService
    )
    
    // Interface controllers
    this.homeController = new HomeController(
      this.listAllArtistsUseCase,
      this.getArtistDetailsUseCase
    )
  }

  configureMiddleware() {
    // Static files
    this.app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')))
    this.app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts')))
    this.app.use('/public', express.static(path.join(__dirname, 'public')))
    
    // JSON parsing
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  setupRoutes() {
    // Counter page
    this.app.get('/contador', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })

    // Web routes
    this.app.get('/', (req, res) => this.homeController.renderHomePage(req, res))
    this.app.get('/artist/:id', (req, res) => this.homeController.renderArtistPage(req, res))
    
    // API routes
    this.app.get('/api/artists', async (req, res) => {
      try {
        const result = await this.listAllArtistsUseCase.execute()
        res.json(result)
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    })
    
    this.app.get('/api/artists/:id', async (req, res) => {
      try {
        const result = await this.getArtistDetailsUseCase.execute({ artistId: req.params.id })
        res.json(result)
      } catch (error) {
        res.status(404).json({ error: error.message })
      }
    })
    
    this.app.get('/api/albums/:name/songs', async (req, res) => {
      try {
        const result = await this.getSongsByAlbumUseCase.execute({ album: req.params.name })
        res.json(result)
      } catch (error) {
        res.status(404).json({ error: error.message })
      }
    })

    // About page
    this.app.get('/about', (req, res) => {
      res.send(this.generateAboutPage())
    })
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).send(this.generate404Page())
    })
    
    // Error handler
    this.app.use((err, req, res, next) => {
      console.error(err.stack)
      res.status(500).send(this.generate500Page())
    })
  }

  generateAboutPage() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - The Real Slim Shady</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <nav class="main-nav">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="/">🎤 The Real Slim Shady</a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/about" class="active">About</a>
            </div>
        </div>
    </nav>

    <main class="main-content">
        <div class="about-section">
            <h1>About This Project</h1>
            <p>This is a demonstration of Clean Architecture principles using a music-themed application inspired by Eminem's "The Real Slim Shady".</p>
            
            <h2>🏗️ Architecture</h2>
            <div class="architecture-grid">
                <div class="layer-card">
                    <h3>Domain Layer</h3>
                    <p>Pure business logic and entities</p>
                </div>
                <div class="layer-card">
                    <h3>Application Layer</h3>
                    <p>Use cases and orchestration</p>
                </div>
                <div class="layer-card">
                    <h3>Infrastructure Layer</h3>
                    <p>Data persistence and external services</p>
                </div>
                <div class="layer-card">
                    <h3>Interfaces Layer</h3>
                    <p>Controllers and web interface</p>
                </div>
            </div>

            <h2>🚀 Tech Stack</h2>
            <ul>
                <li>Node.js & Express.js</li>
                <li>HTML5 & CSS3</li>
                <li>Vanilla JavaScript</li>
                <li>Clean Architecture Pattern</li>
            </ul>

            <h2>📊 API Endpoints</h2>
            <ul>
                <li><code>GET /api/artists</code> - List all artists</li>
                <li><code>GET /api/artists/:id</code> - Get artist details</li>
                <li><code>GET /api/albums/:name/songs</code> - Get songs by album</li>
            </ul>
        </div>
    </main>

    <footer class="main-footer">
        <p>&copy; 2024 The Real Slim Shady Project. Built with Clean Architecture.</p>
    </footer>
</body>
</html>
    `
  }

  generate404Page() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <div class="error-page">
        <h1>404 - Page Not Found</h1>
        <p>Will the real page please stand up?</p>
        <a href="/" class="btn-primary">Go Home</a>
    </div>
</body>
</html>
    `
  }

  generate500Page() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>500 - Server Error</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body>
    <div class="error-page">
        <h1>500 - Server Error</h1>
        <p>Something went wrong on our end. Please try again later.</p>
        <a href="/" class="btn-primary">Go Home</a>
    </div>
</body>
</html>
    `
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🎤 The Real Slim Shady server is running on http://localhost:${this.port}`)
      console.log('📁 Project structure follows Clean Architecture principles')
    })
  }
}

// Start the server
if (require.main === module) {
  const server = new WebServer()
  server.start()
}

module.exports = WebServer