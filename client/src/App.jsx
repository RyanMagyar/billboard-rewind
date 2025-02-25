import { useState } from "react";
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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

const charts = {
  Rock: "Rock",
  Rap: "Hip Hop/R&B",
  Hot: "Hot-100",
  Alt: "Alternative",
  Pop: "Pop",
  Country: "Country",
  Latin: "Latin",
};

function App() {
  //const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chart, setChart] = useState();
  const [chartData, setChartData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleChartChange = (chart) => {
    setChart(chart);
  };

  const getChartData = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Chart:", chart);
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/getChart?date=${encodeURIComponent(
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[50rem] mb-12 mx-auto lg:mb20">
        <h1 className="text-[2.5rem] font-semibold text-center">
          BillBoard Rewind
        </h1>
      </div>
      <div className="flex flex-col items-center mx-auto w-[500px] space-y-4">
        <div className="flex w-[500px] justify-around">
          <Select onValueChange={handleChartChange} value={chart}>
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
          <DatePicker
            startYear={1958}
            endYear={2025}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
        <Button onClick={getChartData}>Get Chart Data</Button>
        <div>
          Selected Date:{" "}
          {selectedDate
            ? format(selectedDate, "yyyy-MM-dd")
            : "No date selected"}
        </div>
      </div>
      <div className="w-[800px] mx-auto">
        <Table>
          <TableCaption>
            {chart} chart for {format(selectedDate, "dd-MM-yyyy")}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-bold text-left">
                Rank
              </TableHead>
              {/*<TableHead className="w-[100px"></TableHead>*/}
              <TableHead className="text-bold">Title</TableHead>
              <TableHead className="text-bold">Artist</TableHead>
              <TableHead className="w-[100px] text-center text-bold">
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
                  <LoadingSpinner
                    size={48}
                    className="text-black-500 mx-auto"
                  />
                </TableCell>
              </TableRow>
            ) : (
              chartData &&
              chartData.map((song) => (
                <TableRow key={song.rank}>
                  <TableCell className="font-bold">{song.rank}</TableCell>
                  {/*
                    <TableCell>
                    
                    <img
                    src={song.cover}
                    alt={song.title}
                    className="w-[100px] h-[100px] object-cover"
                    />
                    </TableCell>
                    */}
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell className="text-center">
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
