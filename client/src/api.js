import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

export const checkUserSession = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/check-session`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, hasSession: data.hasSession };
    } else {
      console.error("Failed to check session:", response.status);
      return { success: false, error: response.status };
    }
  } catch (error) {
    console.error("Error checking session:", error);
    return { success: false, error: error.message };
  }
};

export const fetchChartData = async (selectedDate, chart) => {
  try {
    const response = await fetch(
      `${API_URL}/charts/getChart?date=${encodeURIComponent(
        format(selectedDate, "yyyy-MM-dd")
      )}&chart=${encodeURIComponent(chart)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return {
      success: false,
      error: error.message,
      data: [
        {
          rank: "",
          artist: "",
          title: "Error: No chart data for selected date.",
          position: {
            peakPosition: "",
            positionLastWeek: "",
            weeksOnChart: "",
          },
        },
      ],
    };
  }
};

export const fetchArtistSearch = async (artist) => {
  try {
    const response = await fetch(
      `${API_URL}/artist/searchArtist?q=${encodeURIComponent(artist)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const message = await response.text(); // "Hello"
      throw new Error(message);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return { success: false };
  }
};

export const fetchArtistData = async (artist) => {
  try {
    const response = await await fetch(
      `${API_URL}/charts/getArtist?name=${encodeURIComponent(artist)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return {
      success: false,
      error: error.message,
      data: {
        songs: [
          {
            title: "Artist not found.",
            artist: "",
            debutDate: "",
            peak: null,
            peakDate: "",
            weeksOn: null,
            rank: 0,
          },
        ],
        artist: "Artist not found.",
        url: "",
        numOnes: null,
        topTens: null,
        numSongs: null,
      },
    };
  }
};

export const createSpotifyPlaylist = async (selectedDate, chart, chartData) => {
  try {
    const response = await fetch(
      `${API_URL}/playlist/createPlaylist?date=${encodeURIComponent(
        format(selectedDate, "MM-dd-yyyy")
      )}&chart=${encodeURIComponent(chart)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chartData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    const data = await response.json();
    return {
      success: true,
      playlistUrl: data.playlist.external_urls.spotify,
      songsNotFound: data.failedArray,
    };
  } catch (error) {
    console.error("Error creating playlist:", error);
    return { success: false, error: error.message };
  }
};

export const createSpotifyArtistPlaylist = async (artist, artistData) => {
  try {
    const response = await fetch(
      `${API_URL}/playlist/createPlaylist?artist=${encodeURIComponent(artist)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artistData),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    const data = await response.json();
    return {
      success: true,
      playlistUrl: data.playlist.external_urls.spotify,
      songsNotFound: data.failedArray,
    };
  } catch (error) {
    console.error("Error creating playlist:", error);
    return { success: false, error: error.message };
  }
};
