/**
 * Artist Entity - Represents a musical artist in the domain
 * Domain layer: Contains business rules and invariants
 */
class Artist {
  constructor(id, name, genre, yearsActive) {
    if (!id || typeof id !== 'string') {
      throw new Error('Artist ID is required and must be a string')
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Artist name is required and must be a non-empty string')
    }
    if (!genre || typeof genre !== 'string') {
      throw new Error('Artist genre is required')
    }
    if (!yearsActive || !Array.isArray(yearsActive) || yearsActive.length !== 2) {
      throw new Error('Years active must be an array with start and end year')
    }

    this.id = id
    this.name = name.trim()
    this.genre = genre
    this.yearsActive = yearsActive
    this.createdAt = new Date()
  }

  isActive() {
    const currentYear = new Date().getFullYear()
    return this.yearsActive[1] === null || this.yearsActive[1] >= currentYear
  }

  getCareerLength() {
    const endYear = this.yearsActive[1] || new Date().getFullYear()
    return endYear - this.yearsActive[0]
  }

  equals(other) {
    return other instanceof Artist && this.id === other.id
  }
}

module.exports = Artist