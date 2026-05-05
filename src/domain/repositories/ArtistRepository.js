/**
 * Artist Repository Interface - Defines contract for artist data access
 * Domain layer: Pure abstraction, no implementation details
 */
class ArtistRepository {
  /**
   * Find artist by ID
   * @param {string} id 
   * @returns {Promise<Artist|null>}
   */
  async findById(id) {
    throw new Error('Method must be implemented')
  }

  /**
   * Find artist by name
   * @param {string} name 
   * @returns {Promise<Artist|null>}
   */
  async findByName(name) {
    throw new Error('Method must be implemented')
  }

  /**
   * Get all artists
   * @returns {Promise<Artist[]>}
   */
  async findAll() {
    throw new Error('Method must be implemented')
  }

  /**
   * Save artist (create or update)
   * @param {Artist} artist 
   * @returns {Promise<Artist>}
   */
  async save(artist) {
    throw new Error('Method must be implemented')
  }

  /**
   * Delete artist by ID
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async deleteById(id) {
    throw new Error('Method must be implemented')
  }
}

module.exports = ArtistRepository