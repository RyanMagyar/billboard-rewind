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
});
