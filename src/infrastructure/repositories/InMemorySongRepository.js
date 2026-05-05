/**
 * In-Memory Song Repository Implementation
 * Infrastructure layer: Concrete implementation using in-memory storage
 */
const SongRepository = require('../../domain/repositories/SongRepository')
const Song = require('../../domain/entities/Song')

class InMemorySongRepository extends SongRepository {
  constructor() {
    super()
    this.songs = new Map()
    this.initializeData()
  }

  initializeData() {
    // Sample songs for "The Real Slim Shady" theme
    const songs = [
      new Song('song-1', 'The Real Slim Shady', 'eminem-1', 'The Marshall Mathers LP', 2000, 284),
      new Song('song-2', 'Stan', 'eminem-1', 'The Marshall Mathers LP', 2000, 404),
      new Song('song-3', 'Lose Yourself', 'eminem-1', '8 Mile Soundtrack', 2002, 326),
      new Song('song-4', 'Without Me', 'eminem-1', 'The Eminem Show', 2002, 290),
      new Song('song-5', 'Love The Way You Lie', 'eminem-1', 'Recovery', 2010, 263),
      new Song('song-6', 'Rap God', 'eminem-1', 'The Marshall Mathers LP 2', 2013, 363),
      new Song('song-7', 'Godzilla', 'eminem-1', 'Music to Be Murdered By', 2020, 210)
    ]

    songs.forEach(song => this.songs.set(song.id, song))
  }

  async findById(id) {
    return this.songs.get(id) || null
  }

  async findByArtistId(artistId) {
    return Array.from(this.songs.values()).filter(song => song.artistId === artistId)
  }

  async findByAlbum(album) {
    return Array.from(this.songs.values()).filter(song => 
      song.album.toLowerCase() === album.toLowerCase()
    )
  }

  async findAll() {
    return Array.from(this.songs.values())
  }

  async save(song) {
    if (!(song instanceof Song)) {
      throw new Error('Invalid song entity')
    }
    
    this.songs.set(song.id, song)
    return song
  }

  async deleteById(id) {
    return this.songs.delete(id)
  }
}

module.exports = InMemorySongRepository