import { TypographyH3 } from "@repo/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

type Group = {
  id: string;
  name: string;
};

export default function AttendanceTracker() {
  const [groups, setGroups] = useState<Group[]>([]);

  return (
    <>
      <TypographyH3>Select Group</TypographyH3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
