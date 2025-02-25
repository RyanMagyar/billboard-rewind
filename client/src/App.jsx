import { useState } from "react";
import { Button } from "./components/ui/button";
import { DatePicker } from "./components/ui/datepicker";
import { format } from "date-fns";

function App() {
  //const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <div className="mx-auto w-[300px] space-y-4">
        <Button onClick={() => console.log("Selected Date:", selectedDate)}>
          Log Selected Date
        </Button>
        <DatePicker
          startYear={1958}
          endYear={2025}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div>
          Selected Date:{" "}
          {selectedDate
            ? format(selectedDate, "yyyy-MM-dd")
            : "No date selected"}
        </div>
      </div>
    </>
  );
}

export default App;
