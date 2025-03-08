import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { DatePicker } from "./components/ui/datepicker";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { LoadingSpinner } from "./components/ui/design/loadingspinner";
import { Info as InfoIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

import { chartInfo } from "./constants";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import vinylGif from "./assets/vinyl3.gif";
import vinylLogo from "./assets/recordLogo.svg";
//import spotifyGreen from "./assets/Spotify_Full_Logo_RGB_Green.png";
import spotifyWhite from "./assets/Spotify_Full_Logo_RGB_White.png";

const charts = {
  Rock: "Rock",
  Rap: "Hip Hop/R&B",
  Hot: "Hot-100",
  Alt: "Alternative",
  Pop: "Pop",
  Country: "Country",
  Latin: "Latin",
};

const chartDates = {
  Rock: "1981-03-22",
  Rap: "1958-10-20",
  Hot: "1958-08-04",
  Alt: "1988-09-10",
  Pop: "1961-07-17",
  Country: "1958-10-20",
  Latin: "1986-09-15",
};

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

  const handleChartChange = (chart) => {
    setChart(chart);

    if (selectedDate < new Date(chartDates[chart])) {
      setSelectedDate(new Date(chartDates[chart]));
    }
  };

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
      <div>
        <div className="flex justify-center items-center space-x-2 mt-3 mr-[5px] sm:mr-0 mb-5 mx-auto">
          <img
            className="h-[45px] w-[45px] sm:h-[75px] sm:w-[75px]"
            src={vinylLogo}
          />
          <h1 className="text-[2.0rem] sm:text-[4.5rem] font-semibold text-center">
            Billboard Rewind
          </h1>
        </div>
        <p className="text-center font-semibold mx-auto mt-5 mb-5">
          Connect with
        </p>
        <img className="h-[75px] mx-auto mt-5 mb-10" src={spotifyWhite} />
      </div>
      <div className="flex flex-col items-center mx-auto md:w-[500px] w-full space-y-4">
        <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 w-full sm:w-[500px] items-center justify-around">
          <div className="flex items-center space-x-2 mr-[24px] sm:mr-0">
            <Popover>
              <PopoverTrigger>
                <InfoIcon className="text-gray-500 hover:text-white transition-colors duration-200" />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {chart ? (
                  <div className="flex flex-col gap-4">
                    <h4 className="font-medium text-lg leading-none">
                      {chartInfo[chart].name} Chart
                    </h4>
                    <div>
                      <p className="font-small text-small leading-none">
                        First Chart Date: {chartInfo[chart].firstChart}
                      </p>
                      <p className="my-5 font-small text-small">
                        {" "}
                        {chartInfo[chart].info}
                      </p>
                      <a
                        href={
                          chartInfo[chart].link +
                          (selectedDate
                            ? format(selectedDate, "yyyy-MM-dd")
                            : "")
                        }
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        See chart on BillBoard.com
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm">Select a chart to see info.</p>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Select
              className="w-[250px]"
              onValueChange={handleChartChange}
              value={chart}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a chart" />
              </SelectTrigger>

              <SelectContent>
                {Object.entries(charts).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DatePicker
            startYear={chart ? Number(chartDates[chart].split("-")[0]) : 1958}
            endYear={2025}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            fromDate={chartDates[chart]}
            className=""
          />
        </div>
        <Button disabled={chart ? false : true} onClick={getChartData}>
          Get Chart Data
        </Button>
        {/*
        <div>
          Selected Date:{" "}
          {selectedDate
            ? format(selectedDate, "yyyy-MM-dd")
            : "No date selected"}
        </div>*/}
        <div className="py-5">
          {playlistIsLoading ? (
            <LoadingSpinner size={48} className="text-purple-500 mx-auto" />
          ) : playlistUrl ? (
            <a
              href={playlistUrl}
              className=""
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700">
                View Your Playlist on Spotify
              </Button>
            </a>
          ) : null}
        </div>
        <div className="w-[350px] md:w-[400px]">
          {songsNotFound ? (
            <Table>
              <TableCaption className="text-red-400">
                Songs Spotify couldn&apos;t add
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-bold text-left">
                    Rank
                  </TableHead>
                  <TableHead className="text-bold">Title</TableHead>
                  <TableHead className="text-bold">Artist</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {songsNotFound &&
                  songsNotFound.map((song) => (
                    <TableRow key={song.rank}>
                      <TableCell className="font-bold">{song.rank}</TableCell>
                      <TableCell>{song.title}</TableCell>
                      <TableCell>{song.artist}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : null}
        </div>
      </div>
      <div className="w-full overflow-auto mx-auto mb-10">
        <div className="flex w-full md:w-[600px] lg:w-[800px] mx-auto justify-center md:justify-end mt-5">
          {isLoggedIn ? (
            <Button
              disabled={chartData ? (playlistIsLoading ? true : false) : true}
              onClick={createSpotifyPlaylist}
            >
              Create Playlist
            </Button>
          ) : (
            <a className="" href={`${import.meta.env.VITE_API_URL}/auth/login`}>
              <Button className="">Connect to Spotify</Button>
            </a>
          )}
        </div>
        <Table className="w-full md:w-[600px] lg:w-[900px] mx-auto">
          <TableCaption className="pt-5">
            {chart
              ? selectedDate
                ? `${charts[chart]} chart for ${format(
                    selectedDate,
                    "MM-dd-yyyy"
                  )}`
                : "Please select a date"
              : "Please select a chart"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-bold text-left">
                Rank
              </TableHead>
              {/*<TableHead className="w-[100px"></TableHead>*/}
              <TableHead className="text-bold">Title</TableHead>
              <TableHead className="text-bold">Artist</TableHead>
              <TableHead className="hidden sm:table-cell w-[100px] text-center text-bold">
                Last Week
              </TableHead>
              <TableHead className="w-[100px] text-center text-bold">
                Peak Rank
              </TableHead>
              <TableHead className="w-[100px] text-center text-bold">
                Weeks On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center h-[200px]">
                  {/*<LoadingSpinner
                    size={48}
                    className="text-purple-500 mx-auto"
                  />*/}
                  <img
                    src={vinylGif}
                    alt="Spinning Record"
                    className="text-black-500 w-64 h-64 mx-auto"
                  />
                </TableCell>
              </TableRow>
            ) : (
              chartData &&
              chartData.map((song) => (
                <TableRow key={song.rank}>
                  <TableCell className="font-bold">{song.rank}</TableCell>
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {song.position.positionLastWeek}
                  </TableCell>
                  <TableCell className="text-center">
                    {song.position.peakPosition}
                  </TableCell>
                  <TableCell className="text-center">
                    {song.position.weeksOnChart}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default App;
