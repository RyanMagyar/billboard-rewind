import { useState } from "react";
import { Button } from "./components/ui/button";
import { DatePicker } from "./components/ui/datepicker";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="mx-auto w-[200px]">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <DatePicker startYear={1958} endYear={2025} />
      </div>
    </>
  );
}

export default App;
