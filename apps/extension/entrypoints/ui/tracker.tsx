import { TypographyH3 } from "@repo/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { buildUrl } from "../utils/constants";
import { AuthContext } from "./providers/auth";

type Group = {
  id: string;
  name: string;
  isDefault: boolean;
};

export default function AttendanceTracker() {
  const [groups, setGroups] = useState<Group[]>([]);
  const authToken = useContext(AuthContext);

  const [portalContainer, setPortalContainer] = useState<HTMLDivElement>();

  const fetchGroups = async () => {
    const response = await fetch(buildUrl("/groups"), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken?.token,
      },
    });
    const data = await response.json();

    const groups: Group[] = [];

    for (const group of data) {
      groups.push({
        id: group.id,
        name: group.name,
        isDefault: group.isDefault,
      });
    }
    setGroups(groups);
  };

  useEffect(() => {
    fetchGroups();
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
