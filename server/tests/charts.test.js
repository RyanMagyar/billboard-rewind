const request = require("supertest");
let app = require("../app");
const { rockData1, mockRockResult } = require("./chartConstants");
const { getChart } = require("billboard-top-100");

jest.mock("billboard-top-100", () => ({
  getChart: jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

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

  test("Should return 200 and correct chart data", async () => {
    const query = { chart: "Rock", date: "1981-03-21" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rockData1);
  });

  test("Should return 200 and correct rankings for chart", async () => {
    getChart.mockImplementation((chartName, date, callback) => {
      callback(null, {
        songs: [
          {
            rank: 1,
            title: "I Can't Stand It",
            artist: "Eric Clapton And His Band",
            cover:
              "https://charts-static.billboard.com/img/1970/02/eric-clapton-pmc-180x180.jpg",
            position: {
              positionLastWeek: null,
              peakPosition: 1,
              weeksOnChart: 1,
            },
          },
          {
            rank: 2,
            title: "While You See A Chance",
            artist: "Steve Winwood",
            cover:
              "https://charts-static.billboard.com/img/1981/03/steve-winwood-6hs-180x180.jpg",
            position: {
              positionLastWeek: null,
              peakPosition: 2,
              weeksOnChart: 1,
            },
          },
          {
            rank: 3,
            title: "The Party's Over (Hopelessly In Love)",
            artist: "Journey",
            cover:
              "https://charts-static.billboard.com/img/1975/05/journey-0b3-180x180.jpg",
            position: {
              positionLastWeek: null,
              peakPosition: 3,
              weeksOnChart: 1,
            },
          },
        ],
        week: "1981-03-21",
      });
    });

    const response = await request(app)
      .get("/charts/getChart")
      .query({ chart: "Rock", date: "1981-03-01" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRockResult);
  });
});
