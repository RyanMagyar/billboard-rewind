/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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

export function DatePicker({
  startYear,
  endYear,
  selectedDate,
  onDateChange,
  fromDate,
}) {
  const [date, setDate] = useState(selectedDate || new Date());
  const [visibleMonth, setVisibleMonth] = useState(selectedDate || new Date());
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    // Update date if selectedDate prop changes
    // console.log("Update: " + selectedDate);
    if (selectedDate && selectedDate.getTime() !== date.getTime()) {
      setDate(selectedDate);
      setVisibleMonth(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    // Update parent state whenever the local state changes
    onDateChange(date);
  }, [date, onDateChange]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  //console.log(years);
  //console.log(startYear);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[250px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0",
          isMobile &&
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        )}
      >
        <div className="flex justify-between p-2">
          <Select
            onValueChange={handleMonthChange}
            value={months[getMonth(visibleMonth)]}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="h-[320px]">
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
            <SelectContent className="h-[320px]">
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
          fromDate={new Date(fromDate)}
          toDate={Date.now()}
        />
      </PopoverContent>
    </Popover>
  );
}
