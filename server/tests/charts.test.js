const request = require("supertest");
let app = require("../app");

describe("GET /charts/getChart", () => {
  test("Should return 400 for missing query parameters", async () => {
    const queries = [
      { chart: "Rock", date: "" },
      { chart: "", date: "12-31-2023" },
      { chart: "", date: "" },
    ];

    for (const query of queries) {
      const response = await request(app).get("/charts/getChart").query(query);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Missing query params!");
    }
  });

  test("Should return 400 for improper chart name", async () => {
    const queries = [
      { chart: "Grunge", date: "1961-01-01" },
      { chart: "Hello", date: "1961-01-01" },
      { chart: "rock", date: "1961-01-01" },
    ];

    for (const query of queries) {
      const response = await request(app).get("/charts/getChart").query(query);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Improper chart name.");
    }
  });

  test("Should return 400 for incorrect date format", async () => {
    const queries = [
      { chart: "Rock", date: "2024-00-20" },
      { chart: "Rock", date: "2021-1-31" },
      { chart: "Rock", date: "2012-10-1" },
      { chart: "Rock", date: "2012-13-10" },
    ];
    for (const query of queries) {
      const response = await request(app).get("/charts/getChart").query(query);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Improper date format.");
    }
  });

  test("Should return 400 for Error retrieving chart data", async () => {
    const queries = [{ chart: "Rock", date: "2030-01-01" }];
    for (const query of queries) {
      const response = await request(app).get("/charts/getChart").query(query);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Error retrieving chart data."
      );
    }
  });
});
