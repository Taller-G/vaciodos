/**
 * Get Artist Details Use Case - Retrieves detailed artist information
 * Application layer: Orchestrates domain objects to fulfill business requirements
 */
const ArtistDto = require('../dtos/ArtistDto')
const SongDto = require('../dtos/SongDto')

class GetArtistDetails {
  constructor(artistRepository, songRepository, musicService) {
    this.artistRepository = artistRepository
    this.songRepository = songRepository
    this.musicService = musicService
  }

  async execute(dto) {
    if (!dto || !dto.artistId) {
      throw new Error('Artist ID is required')
    }

    const artist = await this.artistRepository.findById(dto.artistId)
    if (!artist) {
      throw new Error('Artist not found')
    }

    const songs = await this.songRepository.findByArtistId(dto.artistId)
    const isLegendary = this.musicService.isLegendaryArtist(artist, songs)
    const orderedSongs = this.musicService.getRecommendedListeningOrder(songs)

    return {
      artist: ArtistDto.fromEntity(artist),
      songs: orderedSongs.map(song => SongDto.fromEntity(song, this.musicService)),
      totalSongs: songs.length,
      isLegendary,
      stats: {
        classicSongs: songs.filter(song => song.isClassic()).length,
        averageYear: this.calculateAverageReleaseYear(songs),
        longestSong: this.findLongestSong(songs)
      }
    }
  }

  calculateAverageReleaseYear(songs) {
    if (songs.length === 0) return 0
    const sum = songs.reduce((acc, song) => acc + song.releaseYear, 0)
    return Math.round(sum / songs.length)
  }

  findLongestSong(songs) {
    if (songs.length === 0) return null
    const longest = songs.reduce((prev, current) => 
      current.durationSeconds > prev.durationSeconds ? current : prev
    )
    return SongDto.fromEntity(longest, this.musicService)
  }
}

module.exports = GetArtistDetails