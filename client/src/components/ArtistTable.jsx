/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { format } from "date-fns";
import vinylGif from "../assets/vinyl3.gif";

function ArtistTable({ artist, artistData, isLoading }) {
  return (
    <>
      <div className="w-full max-w-full overflow-hidden mx-auto mb-10">
        <Table className="w-full md:w-[600px] lg:w-[900px] mx-auto">
          <TableCaption className="pt-5">
            {artist ? `Chart history for ${artist}` : "Please choose an artist"}
          </TableCaption>
          <TableHeader className="">
            <TableRow>
              <TableHead className="text-bold">Title</TableHead>
              <TableHead className="text-bold">Artist</TableHead>
              <TableHead className="text-bold">Peak</TableHead>
              <TableHead className="hidden sm:table-cell md:w-[50px]  lg:w-[100px] text-center text-bold">
                Debut
              </TableHead>
              <TableHead className="hidden sm:table-cell md:w-[50px] lg:w-[100px] text-center text-bold">
                Peak Date
              </TableHead>
              <TableHead className="md:w-[50px] lg:w-[100px] text-center text-bold">
                Weeks On
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center h-[200px]">
                  <img
                    src={vinylGif}
                    alt="Spinning Record"
                    className="text-black-500 w-64 h-64 mx-auto"
                  />
                </TableCell>
              </TableRow>
            ) : (
              artistData &&
              artistData.songs.map((song) => (
                <TableRow key={song.rank}>
                  <TableCell className="">{song.title}</TableCell>
                  <TableCell className="">{song.artist}</TableCell>
                  <TableCell className="text-center">{song.peak}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {format(song.debutDate, "MM-dd-yyyy")}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {format(song.peakDate, "MM-dd-yyyy")}
                  </TableCell>
                  <TableCell className="text-center">{song.weeksOn}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export default ArtistTable;
