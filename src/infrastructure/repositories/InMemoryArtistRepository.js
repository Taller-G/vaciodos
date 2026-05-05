/**
 * In-Memory Artist Repository Implementation
 * Infrastructure layer: Concrete implementation using in-memory storage
 */
const ArtistRepository = require('../../domain/repositories/ArtistRepository')
const Artist = require('../../domain/entities/Artist')

class InMemoryArtistRepository extends ArtistRepository {
  constructor() {
    super()
    this.artists = new Map()
    this.initializeData()
  }

  initializeData() {
    // Sample data for "The Real Slim Shady" theme
    const eminem = new Artist(
      'eminem-1',
      'Eminem',
      'Hip Hop',
      [1996, null] // Still active
    )

    this.artists.set(eminem.id, eminem)
  }

  async findById(id) {
    return this.artists.get(id) || null
  }

  async findByName(name) {
    for (const artist of this.artists.values()) {
      if (artist.name.toLowerCase() === name.toLowerCase()) {
        return artist
      }
    }
    return null
  }

  async findAll() {
    return Array.from(this.artists.values())
  }

  async save(artist) {
    if (!(artist instanceof Artist)) {
      throw new Error('Invalid artist entity')
    }
    
    this.artists.set(artist.id, artist)
    return artist
  }

  async deleteById(id) {
    return this.artists.delete(id)
  }
}

module.exports = InMemoryArtistRepository