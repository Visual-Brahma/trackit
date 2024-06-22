import { TypographyH2, TypographyP, TypographyH3 } from "@repo/ui/typography";
import { fetchUserProfile } from "@/lib/api/user";
import { toast } from "@repo/ui/sonner";
import {
  EmailPreferenceForm,
  NameForm,
} from "@/components/dashboard/settings/forms";
import { getServerSession } from "next-auth";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { UnAuthenticatedUserError } from "@/components/errors/unauthenticated";

const SettingsPage = async () => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    toast.error("Error fetching user session");
    return <UnAuthenticatedUserError />;
  }

  const profile = await fetchUserProfile(session.user.email);
  if (!profile) {
    toast.error("Error fetching profile");
    return (
      <div>
        <TypographyP className="text-red-200">
          Error fetching user profile
        </TypographyP>
      </div>
    );
  }

  return (
    <div>
      <TypographyH2>Settings</TypographyH2>
      <div className="my-4 mt-6">
        <TypographyH3>General</TypographyH3>
        <div className="w-full max-w-screen-md">
          <NameForm name={profile.name || ""} email={session.user.email} />
          <div className="flex items-center space-x-4 w-full justify-between">
            <TypographyP>Email</TypographyP>
            <TypographyP>{profile.email}</TypographyP>
          </div>
        </div>
      </div>
      <EmailPreferenceForm
        checked={profile.newsletter}
        email={session.user.email}
      />
      <div className="mt-6">
        <TypographyH3>Danger Zone</TypographyH3>
        <Card className="backdrop-blur-xl backdrop-opacity-60 my-6 bg-destructive/30 ring-2 w-full max-w-md px-2">
          <CardContent className="p-4 flex flex-col items-start justify-center space-y-2">
            <p className="text-sm text-left font-semibold">
              Deleting your account will remove all your attendance reports,
              group memberships and notes. This is an irreversible process,
              think once more before moving ahead.
            </p>

            <p>You will soon have option to delete your account.</p>

            <Button disabled variant="destructive">
              Delete
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
