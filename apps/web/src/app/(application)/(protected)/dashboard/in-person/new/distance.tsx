import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useState } from "react";

export default function DistanceInput({
  value,
  onChange,
  placeholder = "Allowed Range e.g. 20 m",
}: {
  placeholder?: string;
  value: number;
  onChange: (range: number) => void;
}) {
  const [unit, setUnit] = useState<"Km" | "m">("m");
  const [distance, setDistance] = useState(value);

  return (
    <div className="flex">
      <Input
        placeholder={placeholder}
        defaultValue={distance}
        className="rounded-s-lg rounded-e-none"
        onChange={(e) => {
          setDistance(parseFloat(e.target.value));
          onChange(
            unit === "m"
              ? parseFloat(e.target.value)
              : parseFloat(e.target.value) * 1000,
          );
        }}
        type="number"
      />
      <Select
        defaultValue={unit}
        onValueChange={(value: "Km" | "m") => {
          if (value != unit) {
            setUnit(value as "Km" | "m");
            onChange(value === "m" ? distance : distance * 1000);
          }
        }}
      >
        <SelectTrigger className="w-1/4 rounded-e-lg rounded-s-none">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {["Km", "m"].map((choice) => (
            <SelectItem key={choice} value={choice}>
              {choice}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
