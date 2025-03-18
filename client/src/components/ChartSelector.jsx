/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { DatePicker } from "./ui/datepicker";
import { Info as InfoIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { chartInfo, charts, chartDates } from "../constants";
import { format } from "date-fns";

function ChartSelector({
  selectedDate,
  setSelectedDate,
  chart,
  setChart,
  getChartData,
}) {
  const handleChartChange = (chart) => {
    setChart(chart);

    if (selectedDate < new Date(chartDates[chart])) {
      setSelectedDate(new Date(chartDates[chart]));
    }
  };

  return (
    <>
      <div className="mx-auto font-semibold text-center mb-4">
        <p>Select a Billboard chart and a date!</p>
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
                        First Chart: Week of {chartInfo[chart].firstChart}
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
      </div>
    </>
  );
}

export default ChartSelector;
