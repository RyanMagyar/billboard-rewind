import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChartSelector from "./components/ChartSelector";
import PlaylistSection from "./components/PlaylistSection";
import ChartTable from "./components/ChartTable";
import { format } from "date-fns";

function App() {
  //const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chart, setChart] = useState();
  const [chartData, setChartData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [playlistIsLoading, setPlaylistIsLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [songsNotFound, setSongsNotFound] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/check-session`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.hasSession);
        } else {
          console.error("Failed to check session:", response.status);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, []);

  const getChartData = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Chart:", chart);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/charts/getChart?date=${encodeURIComponent(
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
      console.log("Chart Data:", data);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData([
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
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const createSpotifyPlaylist = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Chart:", chart);
    setPlaylistIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/playlist/createPlaylist?date=${encodeURIComponent(
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
      console.log("Playlist Data:", data);
      setPlaylistUrl(data.playlist.external_urls.spotify);
      setSongsNotFound(data.failedArray);
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    } finally {
      setPlaylistIsLoading(false);
    }
  };

  // Make buttons disabled when appropriate

  return (
    <>
      <Header />

      <ChartSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        chart={chart}
        setChart={setChart}
        getChartData={getChartData}
      />

      <PlaylistSection
        playlistIsLoading={playlistIsLoading}
        playlistUrl={playlistUrl}
        songsNotFound={songsNotFound}
        isLoggedIn={isLoggedIn}
        chartData={chartData}
        createSpotifyPlaylist={createSpotifyPlaylist}
      />

      <ChartTable
        isLoading={isLoading}
        chartData={chartData}
        chart={chart}
        selectedDate={selectedDate}
      />
    </>
  );
}

export default App;
