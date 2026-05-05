/**
 * Song Data Transfer Object - Contract for song data exchange
 * Application layer: Defines how song data flows between layers
 */
class SongDto {
  constructor(id, title, artistId, album, releaseYear, duration, formattedDuration, isClassic = false, era = '') {
    this.id = id
    this.title = title
    this.artistId = artistId
    this.album = album
    this.releaseYear = releaseYear
    this.duration = duration
    this.formattedDuration = formattedDuration
    this.isClassic = isClassic
    this.era = era
  }

  static fromEntity(song, musicService = null) {
    if (!song) return null
    
    return new SongDto(
      song.id,
      song.title,
      song.artistId,
      song.album,
      song.releaseYear,
      song.durationSeconds,
      song.getDurationFormatted(),
      song.isClassic(),
      musicService ? musicService.classifySongEra(song) : ''
    )
  }
}

module.exports = SongDto