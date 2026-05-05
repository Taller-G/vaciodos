/**
 * Song Entity - Represents a musical song in the domain
 * Domain layer: Contains business rules and invariants
 */
class Song {
  constructor(id, title, artistId, album, releaseYear, durationSeconds) {
    if (!id || typeof id !== 'string') {
      throw new Error('Song ID is required and must be a string')
    }
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Song title is required and must be a non-empty string')
    }
    if (!artistId || typeof artistId !== 'string') {
      throw new Error('Artist ID is required')
    }
    if (!album || typeof album !== 'string') {
      throw new Error('Album name is required')
    }
    if (!releaseYear || typeof releaseYear !== 'number' || releaseYear < 1900) {
      throw new Error('Valid release year is required')
    }
    if (!durationSeconds || typeof durationSeconds !== 'number' || durationSeconds <= 0) {
      throw new Error('Duration must be a positive number in seconds')
    }

    this.id = id
    this.title = title.trim()
    this.artistId = artistId
    this.album = album
    this.releaseYear = releaseYear
    this.durationSeconds = durationSeconds
    this.createdAt = new Date()
  }

  getDurationFormatted() {
    const minutes = Math.floor(this.durationSeconds / 60)
    const seconds = this.durationSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  isClassic() {
    const currentYear = new Date().getFullYear()
    return currentYear - this.releaseYear >= 20
  }

  equals(other) {
    return other instanceof Song && this.id === other.id
  }
}

module.exports = Song