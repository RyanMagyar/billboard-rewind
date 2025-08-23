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
import { useState, useMemo } from "react";
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
import { format } from "date-fns";
import vinylGif from "../assets/vinyl3.gif";

function ArtistTable({ artist, artistData, isLoading }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedData = useMemo(() => {
    if (!artistData || !artistData.songs) return [];

    return [...artistData.songs].sort((a, b) => {
      if (!sortConfig.key) return 0;

      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (sortConfig.key === "debutDate" || sortConfig.key === "peakDate") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (sortConfig.key === "peak" || sortConfig.key === "weeksOn") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (valueA < valueB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [artistData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }

      return {
        key,
        direction: "ascending",
      };
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDownIcon className="ml-2 h-4 w-4 opacity-50" />;
    }

    return sortConfig.direction === "ascending" ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="w-[100vw] max-w-full overflow-hidden mx-auto mb-10">
      <Table className="w-[100vw] md:w-[600px] lg:w-[950px] mx-auto">
        <TableCaption className="pt-5">
          {artist ? `Chart history for ${artist}` : "Please choose an artist"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            {[
              { key: "title", label: "Title", className: "text-bold" },
              { key: "artist", label: "Artist", className: "text-bold" },
              { key: "peak", label: "Peak", className: "text-bold" },
              {
                key: "debutDate",
                label: "Debut",
                className:
                  "hidden sm:table-cell md:w-[50px] lg:w-[100px] text-center text-bold",
              },
              {
                key: "peakDate",
                label: "Peak Date",
                className:
                  "flex items-center hidden sm:table-cell md:w-[50px] lg:w-[120px] text-center text-bold",
              },
              {
                key: "weeksOn",
                label: "Weeks On",
                className: "md:w-[50px] lg:w-[120px] text-center text-bold",
              },
            ].map(({ key, label, className = "" }) => (
              <TableHead
                key={key}
                className={`${className} cursor-pointer hover:bg-accent text-center`}
                onClick={() => handleSort(key)}
              >
                <div
                  className={`flex items-center ${
                    ["peak", "debutDate", "peakDate", "weeksOn"].includes(key)
                      ? "justify-center"
                      : ""
                  }`}
                >
                  {label}
                  {getSortIcon(key)}
                </div>
              </TableHead>
            ))}
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
            sortedData.map((song) => (
              <TableRow key={song.rank}>
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell className="text-center">{song.peak}</TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  {song.debutDate ? format(song.debutDate, "MM-dd-yyyy") : ""}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  {song.peakDate ? format(song.peakDate, "MM-dd-yyyy") : ""}
                </TableCell>
                <TableCell className="text-center">{song.weeksOn}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default ArtistTable;
