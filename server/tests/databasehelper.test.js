const { selectChart, insertChart } = require("../utils/databaseHelper");
const db = require("../db");

describe("Database Helper Functions", () => {
  beforeEach(async () => {
    await db.query("TRUNCATE TABLE charts RESTART IDENTITY CASCADE;"); // Reset DB before each test
  });

  it("should insert and retrieve a chart", async () => {
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

  it("should retrieve no chart", async () => {
    const result = await selectChart("Rock", "2023-03-01");
    expect(result.rows.length).toBe(0);
  });
});
