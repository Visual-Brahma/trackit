import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import banner from "@/assets/images/banner.png";

export interface GroupCardProps {
  name: string;
  ownerName: string;
  bannerUrl: string;
  avatarUrl: string;
  desc: string;
  memberCount: number;
}

export const GroupCard = ({
  name,
  bannerUrl,
  avatarUrl,
  memberCount,
  desc,
  ownerName,
}: GroupCardProps) => {
  return (
    <div className="flex align-center justify-center ">
      <Card className="w-[354px] my-5 rounded-2xl">
        <CardHeader
          style={{
            backgroundImage: `url(${banner.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <CardTitle className="text-white text-left">{name}</CardTitle>
          <div className="text-white text-left">{ownerName}</div>
        </CardHeader>
        <CardContent className="h-60 ">
          <div
            style={{
              backgroundImage: `url(${avatarUrl})`,
              backgroundRepeat: "no-repeat",
              width: "4rem",
              height: "4rem",
              backgroundSize: "cover",
              transform: "translate(15rem,-2rem)",
              borderRadius: "2rem",
            }}
          ></div>
          <div className="text-left">{desc}</div>
        </CardContent>
        <CardFooter className="h-6 text-right flex pb-5 mr-5 my-2 flex-row-reverse rounded-2xl">
          {memberCount}
          <svg
            style={{ margin: ".4rem" }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-users-round"
          >
            <path d="M18 21a8 8 0 0 0-16 0" />
            <circle cx="10" cy="8" r="5" />
            <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
          </svg>
        </CardFooter>
      </Card>
    </div>
  );
};
