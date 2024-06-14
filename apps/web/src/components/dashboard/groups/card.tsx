import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { LucideUserRound } from "lucide-react";
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
            backgroundImage: `url(${bannerUrl})`,
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
        <CardFooter className="h-6 flex pb-5 mr-5 my-2 justify-end rounded-2xl">
          <LucideUserRound className="mr-2" />
          {memberCount}
        </CardFooter>
      </Card>
    </div>
  );
};
