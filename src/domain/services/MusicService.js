/**
 * Music Domain Service - Business logic that doesn't belong to a single entity
 * Domain layer: Pure business rules, no infrastructure dependencies
 */
class MusicService {
  constructor() {
    // Domain services are stateless
  }

  /**
   * Calculates if an artist is considered legendary based on domain rules
   * @param {Artist} artist 
   * @param {Song[]} songs 
   * @returns {boolean}
   */
  isLegendaryArtist(artist, songs) {
    if (!artist || !songs) {
      return false
    }

    const careerLength = artist.getCareerLength()
    const songCount = songs.length
    const hasClassicSongs = songs.some(song => song.isClassic())

    // Domain rule: Artist is legendary if they have 10+ year career, 
    // 20+ songs, and at least one classic
    return careerLength >= 10 && songCount >= 20 && hasClassicSongs
  }

  /**
   * Determines the era classification for a song based on release year
   * @param {Song} song 
   * @returns {string}
   */
  classifySongEra(song) {
    if (!song) {
      throw new Error('Song is required')
    }

    const year = song.releaseYear
    
    if (year >= 2020) return 'Modern'
    if (year >= 2010) return '2010s'
    if (year >= 2000) return '2000s'
    if (year >= 1990) return '90s'
    if (year >= 1980) return '80s'
    return 'Classic'
  }

  /**
   * Calculates recommended listening order for songs
   * @param {Song[]} songs 
   * @returns {Song[]}
   */
  getRecommendedListeningOrder(songs) {
    if (!songs || songs.length === 0) {
      return []
    }

    // Domain rule: Order by release year, then by popularity (album name alphabetically)
    return [...songs].sort((a, b) => {
      if (a.releaseYear !== b.releaseYear) {
        return a.releaseYear - b.releaseYear
      }
      return a.album.localeCompare(b.album)
    })
  }
}

module.exports = MusicService