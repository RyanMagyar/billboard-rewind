const request = require("supertest");
let app = require("../app");
const {
  rockData1,
  mockRockData,
  mockRockResult,
  firstLatinResult,
  firstRbResult,
  firstRockResult,
  firstHotResult,
  firstAltResult,
  firstPopResult,
  firstCountryResult,
} = require("./chartConstants");
const { getChart } = require("billboard-top-100");
const realGetChart = jest.requireActual("billboard-top-100").getChart;
const { selectChart, insertChart } = require("../utils/databaseHelper");

jest.mock("../utils/databaseHelper", () => ({
  selectChart: jest.fn(),
  insertChart: jest.fn(),
}));

jest.mock("billboard-top-100", () => ({
  getChart: jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
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
    getChart.mockImplementation(realGetChart);
    selectChart.mockResolvedValue({ rows: [] });
    insertChart.mockResolvedValue();

    const queries = [{ chart: "Rock", date: "2030-01-01" }];
    for (const query of queries) {
      const response = await request(app).get("/charts/getChart").query(query);

      expect(response.status).toBe(400);
      expect(selectChart).toHaveBeenCalledWith("Rock", expect.any(String));
      expect(insertChart).toHaveBeenCalledTimes(0);
      expect(response.body).toHaveProperty(
        "message",
        "Error retrieving chart data."
      );
    }
  });

  test("Should return 200 and correct rock chart data", async () => {
    getChart.mockImplementation(realGetChart);
    selectChart.mockResolvedValue({ rows: [] });
    insertChart.mockResolvedValue();

    const query = { chart: "Rock", date: "1981-03-21" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(rockData1);
    expect(selectChart).toHaveBeenCalledWith("Rock", expect.any(String));
    expect(insertChart).toHaveBeenCalled();
  });

  test("Should return 200 and correct rock chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    selectChart.mockResolvedValue({ rows: [] });
    insertChart.mockResolvedValue();

    const query = { chart: "Rock", date: "1981-03-20" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstRockResult);
    expect(selectChart).toHaveBeenCalledWith("Rock", expect.any(String));
    expect(insertChart).toHaveBeenCalled();
  });

  test("Should return 200 and correct Hot-100 chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    const query = { chart: "Hot", date: "1958-08-03" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstHotResult);
  });

  test("Should return 200 and correct Alt chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    const query = { chart: "Alt", date: "1988-08-09" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstAltResult);
  });

  test("Should return 200 and correct pop chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    const query = { chart: "Pop", date: "1961-07-16" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstPopResult);
  });

  test("Should return 200 and correct country chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    const query = { chart: "Country", date: "1958-10-19" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstCountryResult);
  });

  test("Should return 200 and correct hip hop/r&b chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    const query = { chart: "Rap", date: "1958-10-19" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstRbResult);
  });

  test("Should return 200 and correct latin chart data for first available week", async () => {
    getChart.mockImplementation(realGetChart);
    const query = { chart: "Latin", date: "1986-09-14" };
    const response = await request(app).get("/charts/getChart").query(query);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(firstLatinResult);
  });

  test("Should return 200 and correct rankings for chart", async () => {
    getChart.mockImplementation((chartName, date, callback) => {
      callback(null, {
        songs: mockRockData,
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
