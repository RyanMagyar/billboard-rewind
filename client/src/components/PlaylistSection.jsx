/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { LoadingSpinner } from "./ui/design/loadingspinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

function PlaylistSection({
  playlistIsLoading,
  playlistUrl,
  songsNotFound,
  isLoggedIn,
  chartData,
  createSpotifyPlaylist,
  tab,
}) {
  return (
    <>
      <div className="flex flex-col items-center mx-auto md:w-[500px] w-full">
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
        <div className="w-[375px] md:w-[400px]">
          {songsNotFound ? (
            <Table>
              <TableCaption className="text-red-400">
                Songs Spotify couldn&apos;t add
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-bold text-left">
                    {tab === "chart" ? "Rank" : "Peak"}
                  </TableHead>
                  <TableHead className="text-bold">Title</TableHead>
                  <TableHead className="text-bold">Artist</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {songsNotFound &&
                  songsNotFound.map((song) => (
                    <TableRow key={song.title}>
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
      <div className="w-full max-w-full overflow-hidden mx-auto">
        <div className="flex w-full md:w-[600px] lg:w-[800px] mx-auto justify-center md:justify-end mt-5">
          {isLoggedIn ? (
            <Button
              disabled={!chartData || playlistIsLoading}
              onClick={createSpotifyPlaylist}
            >
              Create Playlist
            </Button>
          ) : (
            <a href={`${import.meta.env.VITE_API_URL}/auth/login`}>
              <Button>Connect to Spotify</Button>
            </a>
          )}
        </div>
      </div>
    </>
  );
}

export default PlaylistSection;
