/**
 * Get Songs By Album Use Case - Retrieves all songs from a specific album
 * Application layer: Orchestrates domain objects for album-specific queries
 */
const SongDto = require('../dtos/SongDto')

class GetSongsByAlbum {
  constructor(songRepository, artistRepository, musicService) {
    this.songRepository = songRepository
    this.artistRepository = artistRepository
    this.musicService = musicService
  }

  async execute(dto) {
    if (!dto || !dto.album) {
      throw new Error('Album name is required')
    }

    const songs = await this.songRepository.findByAlbum(dto.album)
    if (songs.length === 0) {
      return {
        album: dto.album,
        songs: [],
        totalDuration: 0,
        artistName: null
      }
    }

    // Get artist information from the first song
    const firstSong = songs[0]
    const artist = await this.artistRepository.findById(firstSong.artistId)
    
    const orderedSongs = this.musicService.getRecommendedListeningOrder(songs)
    const totalDuration = songs.reduce((sum, song) => sum + song.durationSeconds, 0)

    return {
      album: dto.album,
      artistName: artist ? artist.name : 'Unknown Artist',
      songs: orderedSongs.map(song => SongDto.fromEntity(song, this.musicService)),
      totalDuration,
      formattedDuration: this.formatDuration(totalDuration),
      releaseYear: songs[0]?.releaseYear || null,
      songCount: songs.length
    }
  }

  formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

module.exports = GetSongsByAlbum