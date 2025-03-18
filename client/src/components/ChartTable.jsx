/* eslint-disable react/prop-types */
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import vinylGif from "../assets/vinyl3.gif";

const charts = {
  Rock: "Rock",
  Rap: "Hip Hop/R&B",
  Hot: "Hot-100",
  Alt: "Alternative",
  Pop: "Pop",
  Country: "Country",
  Latin: "Latin",
};

function ChartTable({ isLoading, chartData, chart, selectedDate }) {
  return (
    <>
      <div className="w-full max-w-full overflow-hidden mx-auto mb-10">
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
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-[50px] text-bold text-left">
                Rank
              </TableHead>
              {/*<TableHead className="w-[100px"></TableHead>*/}
              <TableHead className="text-bold">Title</TableHead>
              <TableHead className="text-bold">Artist</TableHead>
              <TableHead className="hidden sm:table-cell md:w-[50px]  lg:w-[100px] text-center text-bold">
                Last Week
              </TableHead>
              <TableHead className="hidden sm:table-cell md:w-[50px] lg:w-[100px] text-center text-bold">
                Peak Rank
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
                  <TableCell className="">{song.title}</TableCell>
                  <TableCell className="">{song.artist}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {song.position.positionLastWeek}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
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

export default ChartTable;
