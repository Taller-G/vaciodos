# 🎤 The Real Slim Shady

A tribute web application to Eminem's "The Real Slim Shady" built with Clean Architecture principles using HTML, CSS, and JavaScript.

## 📖 Project Description

This project demonstrates a production-ready web application following Clean Architecture patterns. It's a music database and collection manager themed around Eminem's discography, showcasing how to structure code for maintainability, testability, and scalability.

## 🏗️ Clean Architecture Layers

This project strictly follows Clean Architecture principles with clear separation of concerns:

### 📁 Domain Layer (`src/domain/`)
**Pure business logic with zero external dependencies**

- **Entities**: `Artist.js`, `Song.js` - Core business objects with identity and lifecycle
- **Value Objects**: `PlaylistName.js` - Immutable objects representing domain concepts
- **Repository Interfaces**: `ArtistRepository.js`, `SongRepository.js` - Contracts for data access
- **Domain Services**: `MusicService.js` - Business logic that doesn't belong to a single entity

**Rules:**
- No imports from other layers
- Only native language primitives
- Contains all business rules and validation
- Entities protect their own invariants

### 📁 Application Layer (`src/application/`)
**Orchestrates domain objects to fulfill use cases**

- **Use Cases**: `GetArtistDetails.js`, `ListAllArtists.js`, `GetSongsByAlbum.js`
- **DTOs**: `ArtistDto.js`, `SongDto.js` - Data Transfer Objects for layer communication

**Rules:**
- Can import from domain layer only
- Each use case has a single `execute(dto)` method
- No business logic - delegates to domain layer
- Returns DTOs, never raw domain entities

### 📁 Infrastructure Layer (`src/infrastructure/`)
**Implements interfaces defined in domain/application layers**

- **Repository Implementations**: `InMemoryArtistRepository.js`, `InMemorySongRepository.js`
- Future: Database adapters, external API clients, caching implementations

**Rules:**
- Implements interfaces from domain/application
- Contains all external dependencies and I/O
- Maps between external formats and domain entities
- Can import from domain and application layers

### 📁 Interfaces Layer (`src/interfaces/`)
**Entry points and external adapters**

- **Web Controllers**: `HomeController.js` - HTTP request/response handling
- **Server**: `server.js` - Express.js application setup and routing
- **Static Assets**: HTML, CSS, JavaScript for the user interface

**Rules:**
- Thin controllers that delegate to use cases
- Input validation and response serialization
- No business logic
- Can import from application layer only

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to project directory):
   ```bash
   cd the-real-slim-shady
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run validate` - Run both linting and formatting

## 🎯 Features

### Current Features
- **Artist Database**: Browse artists with detailed information
- **Song Collection**: View songs with metadata and classifications
- **Clean UI**: Responsive design with dark/light theme toggle
- **Interactive Elements**: Search, filtering, and sorting functionality
- **API Endpoints**: RESTful API for programmatic access

### Upcoming Features (Architecture Ready)
- Database integration (PostgreSQL/MongoDB)
- User authentication and playlists
- External API integration (Spotify, Last.fm)
- Real-time updates with WebSockets
- Caching layer with Redis

## 🛠️ API Endpoints

### Web Routes
- `GET /` - Home page with artist list
- `GET /artist/:id` - Artist detail page
- `GET /about` - About page with architecture information

### API Routes
- `GET /api/artists` - List all artists
- `GET /api/artists/:id` - Get artist details with songs
- `GET /api/albums/:name/songs` - Get songs from specific album

### Example API Response
```json
{
  "artist": {
    "id": "eminem-1",
    "name": "Eminem",
    "genre": "Hip Hop",
    "isActive": true,
    "careerLength": 28
  },
  "songs": [
    {
      "id": "song-1",
      "title": "The Real Slim Shady",
      "album": "The Marshall Mathers LP",
      "releaseYear": 2000,
      "formattedDuration": "4:44",
      "isClassic": true,
      "era": "2000s"
    }
  ],
  "totalSongs": 7,
  "isLegendary": true
}
```

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions

### Interactive Elements
- **Search & Filter**: Real-time artist search
- **Sorting Options**: Multiple song sorting criteria
- **Theme Toggle**: Dark/light mode with persistence
- **Animations**: Smooth transitions and micro-interactions
- **Keyboard Navigation**: Accessibility support

### Visual Highlights
- **Legendary Artists**: Special badges and styling
- **Classic Songs**: Visual indicators for timeless tracks
- **Era Classifications**: Color-coded time periods
- **Statistics**: Animated counters and data visualization

## 🏛️ Architecture Benefits

### Maintainability
- **Clear Separation**: Each layer has a single responsibility
- **Loose Coupling**: Layers communicate through interfaces
- **High Cohesion**: Related functionality is grouped together

### Testability
- **Pure Functions**: Domain layer is fully testable
- **Mocking**: Infrastructure can be easily mocked
- **Isolated Testing**: Each layer can be tested independently

### Scalability
- **Plugin Architecture**: Easy to add new features
- **Technology Agnostic**: Can swap implementations without affecting business logic
- **Microservice Ready**: Clear boundaries for service extraction

## 📚 Learning Resources

### Clean Architecture
- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Implementing Clean Architecture](https://docs.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)

### Domain-Driven Design
- [Domain-Driven Design Fundamentals](https://www.pluralsight.com/courses/domain-driven-design-fundamentals)
- [DDD Community](https://dddcommunity.org/)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the architecture rules** - ensure your changes fit within the correct layer
4. **Write tests** for your changes
5. **Run the linters**: `npm run validate`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Architecture Guidelines for Contributors

- **Domain Layer**: Only add business logic here. No external dependencies allowed.
- **Application Layer**: Add new use cases here. Each use case should have a single responsibility.
- **Infrastructure Layer**: Add external integrations and technical implementations here.
- **Interfaces Layer**: Add new controllers, routes, or UI components here.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- **Eminem** - For the musical inspiration
- **Robert C. Martin** - For Clean Architecture principles
- **The Clean Code Community** - For architectural guidance
- **Open Source Contributors** - For the tools and libraries that make this possible

## 🔗 Related Projects

- [Clean Architecture Examples](https://github.com/topics/clean-architecture)
- [Domain-Driven Design Samples](https://github.com/topics/domain-driven-design)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Will the real Clean Architecture please stand up?** 🎤

*Built with ❤️ and Clean Architecture principles*