const {
  selectChart,
  insertChart,
  selectSong,
  insertSong,
} = require("../utils/databaseHelper");
const db = require("../db");

describe("Database Helper Functions", () => {
  beforeEach(async () => {
    await db.query("TRUNCATE TABLE charts RESTART IDENTITY CASCADE;"); // Reset DB before each test
  });

  it("should insert and retrieve a chart with no spotify data", async () => {
    await insertChart(
      0,
      [{ title: "Test Song", artist: "Test Artist" }],
      "Rock",
      "2024-03-01",
      false
    );

    const result = await selectChart("Rock", "2024-03-01");
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].songs).toEqual([
      { title: "Test Song", artist: "Test Artist" },
    ]);
  });

  it("should insert and retrieve a chart with spotify data", async () => {
    await insertChart(
      0,
      [{ title: "Test Song", artist: "Test Artist", spotifyURI: "123" }],
      "Rock",
      "2024-03-01",
      true
    );

    const result = await selectChart("Rock", "2024-03-01");
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].songs).toEqual([
      { title: "Test Song", artist: "Test Artist", spotifyURI: "123" },
    ]);
    expect(result.rows[0].spotify_data_filled).toEqual(true);
  });

  it("should update a chart", async () => {
    await insertChart(
      0,
      [{ title: "Test Song", artist: "Test Artist" }],
      "Rock",
      "2024-03-01",
      false
    );
    const result = await selectChart("Rock", "2024-03-01");
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].songs).toEqual([
      { title: "Test Song", artist: "Test Artist" },
    ]);
    expect(result.rows[0].spotify_data_filled).toEqual(false);

    await insertChart(
      1,
      [{ title: "Test Song", artist: "Test Artist", spotifyURI: "123" }],
      "Rock",
      "2024-03-01",
      true
    );
    const result2 = await selectChart("Rock", "2024-03-01");
    expect(result2.rows.length).toBe(1);
    expect(result2.rows[0].songs).toEqual([
      { title: "Test Song", artist: "Test Artist", spotifyURI: "123" },
    ]);
    expect(result2.rows[0].spotify_data_filled).toEqual(true);
  });

  it("shouldn't retrieve a chart", async () => {
    const result = await selectChart("Rock", "2023-03-01");
    expect(result.rows.length).toBe(0);
  });

  it("should insert and retrieve a song with spotify uri", async () => {
    await insertSong("Hey Jude", "The Beatles", "123");
    const result = await selectSong("Hey Jude", "The Beatles");
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].title).toEqual("Hey Jude");
    expect(result.rows[0].artist).toEqual("The Beatles");
    expect(result.rows[0].spotify_uri).toEqual("123");
  });

  it("should insert and retrieve a song without spotify uri", async () => {
    await insertSong("Come Together", "The Beatles");
    const result = await selectSong("Come Together", "The Beatles");
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].title).toEqual("Come Together");
    expect(result.rows[0].artist).toEqual("The Beatles");
    expect(result.rows[0].spotify_uri).toEqual(null);
  });

  it("shouldn't retrieve a song", async () => {
    const result = await selectSong("Hello, Goodbye", "The Beatles");
    expect(result.rows.length).toBe(0);
  });
});
