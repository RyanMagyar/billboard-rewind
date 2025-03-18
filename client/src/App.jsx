import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChartSelector from "./components/ChartSelector";
import PlaylistSection from "./components/PlaylistSection";
import ChartTable from "./components/ChartTable";
import { checkUserSession, fetchChartData, createSpotifyPlaylist } from "./api";

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
    const initializeSession = async () => {
      const sessionResult = await checkUserSession();
      if (sessionResult.success) {
        setIsLoggedIn(sessionResult.hasSession);
      }
    };

    initializeSession();
  }, []);

  const getChartData = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Chart:", chart);
    setIsLoading(true);

    const result = await fetchChartData(selectedDate, chart);
    setChartData(result.success ? result.data : result.data);
    setIsLoading(false);
  };

  const handleCreateSpotifyPlaylist = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Chart:", chart);
    setPlaylistIsLoading(true);

    const result = await createSpotifyPlaylist(selectedDate, chart, chartData);

    if (result.success) {
      setPlaylistUrl(result.playlistUrl);
      setSongsNotFound(result.songsNotFound);
    }

    setPlaylistIsLoading(false);
  };

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
        createSpotifyPlaylist={handleCreateSpotifyPlaylist}
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
