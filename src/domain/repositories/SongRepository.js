/**
 * Song Repository Interface - Defines contract for song data access
 * Domain layer: Pure abstraction, no implementation details
 */
class SongRepository {
  /**
   * Find song by ID
   * @param {string} id 
   * @returns {Promise<Song|null>}
   */
  async findById(id) {
    throw new Error('Method must be implemented')
  }

  /**
   * Find songs by artist ID
   * @param {string} artistId 
   * @returns {Promise<Song[]>}
   */
  async findByArtistId(artistId) {
    throw new Error('Method must be implemented')
  }

  /**
   * Find songs by album
   * @param {string} album 
   * @returns {Promise<Song[]>}
   */
  async findByAlbum(album) {
    throw new Error('Method must be implemented')
  }

  /**
   * Get all songs
   * @returns {Promise<Song[]>}
   */
  async findAll() {
    throw new Error('Method must be implemented')
  }

  /**
   * Save song (create or update)
   * @param {Song} song 
   * @returns {Promise<Song>}
   */
  async save(song) {
    throw new Error('Method must be implemented')
  }

  /**
   * Delete song by ID
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async deleteById(id) {
    throw new Error('Method must be implemented')
  }
}

module.exports = SongRepository