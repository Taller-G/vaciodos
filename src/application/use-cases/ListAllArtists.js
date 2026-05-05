/**
 * List All Artists Use Case - Retrieves all artists with basic information
 * Application layer: Orchestrates domain objects for listing functionality
 */
const ArtistDto = require('../dtos/ArtistDto')

class ListAllArtists {
  constructor(artistRepository, songRepository, musicService) {
    this.artistRepository = artistRepository
    this.songRepository = songRepository
    this.musicService = musicService
  }

  async execute() {
    const artists = await this.artistRepository.findAll()
    
    const artistsWithDetails = await Promise.all(
      artists.map(async artist => {
        const songs = await this.songRepository.findByArtistId(artist.id)
        const isLegendary = this.musicService.isLegendaryArtist(artist, songs)
        
        const artistDto = ArtistDto.fromEntity(artist)
        return {
          ...artistDto,
          songCount: songs.length,
          isLegendary
        }
      })
    )

    return {
      artists: artistsWithDetails,
      totalCount: artistsWithDetails.length,
      legendaryCount: artistsWithDetails.filter(a => a.isLegendary).length
    }
  }
}

module.exports = ListAllArtists