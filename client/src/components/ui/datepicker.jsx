/* eslint-disable react/prop-types */
import * as React from "react";
import {
  format,
  setMonth,
  getMonth,
  getYear,
  setYear,
  addMonths,
  subMonths,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function DatePicker({ startYear, endYear, selectedDate, onDateChange }) {
  const [date, setDate] = React.useState(selectedDate || new Date());
  const [visibleMonth, setVisibleMonth] = React.useState(
    selectedDate || new Date()
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleMonthChange = (month) => {
    const newVisibleMonth = setMonth(visibleMonth, months.indexOf(month));
    setVisibleMonth(newVisibleMonth);
  };

  const handleYearChange = (year) => {
    const newVisibleMonth = setYear(visibleMonth, parseInt(year));
    setVisibleMonth(newVisibleMonth);
  };

  const handlePrevMonth = () => {
    setVisibleMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setVisibleMonth((prev) => addMonths(prev, 1));
  };

  React.useEffect(() => {
    // Update parent state whenever the local state changes
    onDateChange(date);
  }, [date, onDateChange]);
  //console.log(years);
  //console.log(startYear);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(visibleMonth)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={handleYearChange}
            value={getYear(visibleMonth).toString()}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate)}
          initialFocus
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
