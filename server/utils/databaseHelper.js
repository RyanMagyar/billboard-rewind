const db = require("../db");

async function selectChart(genre, chartWeek) {
  const chartQuery = `SELECT * FROM charts WHERE chart_type = $1 AND chart_date = $2`;
  const chartResult = await db.query(chartQuery, [genre, chartWeek]);

  return chartResult;
}
async function selectSong(title, artist) {
  const songQuery = `SELECT * FROM songs WHERE title ILIKE $1 AND artist ILIKE $2`;
  const songResult = await db.query(songQuery, [title, artist]);

  return songResult;
}
async function insertSong(title, artist, spotifyURI) {
  spotifyURI
    ? await db.query(
        `INSERT INTO songs (title, artist, spotify_uri) VALUES ($1, $2, $3) ON CONFLICT (title, artist) DO NOTHING`,
        [title, artist, spotifyURI]
      )
    : await db.query(
        `INSERT INTO songs (title, artist) VALUES ($1, $2) ON CONFLICT (title, artist) DO NOTHING`,
        [title, artist]
      );
  return;
}
async function insertChart(
  rowsLength,
  songArray,
  genre,
  chartWeek,
  spotifyData
) {
  if (rowsLength > 0 && spotifyData) {
    await db.query(
      `UPDATE charts SET songs = $1, spotify_data_filled = TRUE WHERE chart_type = $2 AND chart_date = $3`,
      [JSON.stringify(songArray), genre, chartWeek]
    );
    console.log(JSON.stringify(songArray));
  } else {
    if (spotifyData) {
      await db.query(
        `INSERT INTO charts (chart_type, chart_date, songs, spotify_data_filled) VALUES ($1, $2, $3, TRUE)`,
        [genre, chartWeek, JSON.stringify(songArray)]
      );
    } else {
      await db.query(
        `INSERT INTO charts (chart_type, chart_date, songs, spotify_data_filled) VALUES ($1, $2, $3, FALSE)`,
        [genre, chartWeek, JSON.stringify(songArray)]
      );
    }
    return;
    //console.log(JSON.stringify(songArray, null, 2));
  }
}

module.exports = { selectChart, selectSong, insertSong, insertChart };
