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
  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "Group 1" },
    { id: "2", name: "Group 2" },
  ]);

  return (
    <>
      <TypographyH3>Select Group</TypographyH3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
