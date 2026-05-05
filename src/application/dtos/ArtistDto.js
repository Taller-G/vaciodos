/**
 * Artist Data Transfer Object - Contract for artist data exchange
 * Application layer: Defines how artist data flows between layers
 */
class ArtistDto {
  constructor(id, name, genre, yearsActive, isActive = false, careerLength = 0) {
    this.id = id
    this.name = name
    this.genre = genre
    this.yearsActive = yearsActive
    this.isActive = isActive
    this.careerLength = careerLength
  }

  static fromEntity(artist) {
    if (!artist) return null
    
    return new ArtistDto(
      artist.id,
      artist.name,
      artist.genre,
      artist.yearsActive,
      artist.isActive(),
      artist.getCareerLength()
    )
  }
}

module.exports = ArtistDto