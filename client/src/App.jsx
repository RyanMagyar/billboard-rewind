import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChartSelector from "./components/ChartSelector";
import PlaylistSection from "./components/PlaylistSection";
import ChartTable from "./components/ChartTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  checkUserSession,
  fetchChartData,
  fetchArtistData,
  createSpotifyPlaylist,
} from "./api";
//import { testArtistData } from "./constants";
import ArtistSelector from "./components/ArtistSelector";
import ArtistTable from "./components/ArtistTable";
import { testArtistData } from "./constants";

function App() {
  //const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chart, setChart] = useState();
  const [chartData, setChartData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState("");
  const [artistData, setArtistData] = useState();
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

  const getArtistData = async () => {
    console.log("Selected Artist: ", artist);
    setIsLoading(true);

    const result = await fetchArtistData(artist);
    setArtistData(result.success ? result.data : result.data);
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

      <Tabs defaultValue="chart" className="">
        <TabsList className="grid w-[400px] grid-cols-2 mx-auto mb-5">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="artist">Artist</TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
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
        </TabsContent>
        <TabsContent value="artist">
          <ArtistSelector
            artist={artist}
            setArtist={setArtist}
            getArtistData={getArtistData}
          />

          <PlaylistSection
            playlistIsLoading={playlistIsLoading}
            playlistUrl={playlistUrl}
            songsNotFound={songsNotFound}
            isLoggedIn={isLoggedIn}
            chartData={chartData}
            createSpotifyPlaylist={handleCreateSpotifyPlaylist}
          />

          <ArtistTable
            artist={artist}
            artistData={artistData}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default App;
