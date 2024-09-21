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

  const [portalContainer, setPortalContainer] = useState<HTMLDivElement>();

  useEffect(() => {
    // creates a portal container for radix ui select popover wrapper so that it renders inside the shadow dom
    const shadowRootBody = document.querySelector("trackit-attendance-ui")
      ?.shadowRoot?.firstElementChild?.children[1];
    if (shadowRootBody) {
      const container = document.createElement("div");
      shadowRootBody.appendChild(container);
      setPortalContainer(container);
      return () => {
        shadowRootBody.removeChild(container);
      };
    }
  }, []);

  return (
    <>
      <TypographyH3>Select Group</TypographyH3>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Group" />
        </SelectTrigger>
        <SelectContent container={portalContainer}>
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
