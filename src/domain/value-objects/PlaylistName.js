/**
 * PlaylistName Value Object - Immutable representation of a playlist name
 * Domain layer: Encapsulates validation rules for playlist naming
 */
class PlaylistName {
  constructor(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Playlist name must be a string')
    }

    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      throw new Error('Playlist name cannot be empty')
    }

    if (trimmedName.length > 100) {
      throw new Error('Playlist name cannot exceed 100 characters')
    }

    if (this.containsInappropriateContent(trimmedName)) {
      throw new Error('Playlist name contains inappropriate content')
    }

    this.value = trimmedName
  }

  containsInappropriateContent(name) {
    // Simple content filter - in real app would be more sophisticated
    const inappropriateTerms = ['spam', 'test123', 'untitled']
    return inappropriateTerms.some(term => 
      name.toLowerCase().includes(term.toLowerCase())
    )
  }

  toString() {
    return this.value
  }

  equals(other) {
    return other instanceof PlaylistName && this.value === other.value
  }
}

module.exports = PlaylistName