import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { buildApiUrl } from "@/utils/constants";

export default function SignInPrompt() {
  return (
    <Card className="bg-secondary/20">
      <CardHeader className="flex-row space-y-0 items-center justify-between gap-2 pb-1">
        <CardTitle className="text-danger">Not Signed In</CardTitle>
        <Button variant="outline" size="sm" className="rounded-lg" asChild>
          <a href={buildApiUrl("/auth/signin")} target="_blank" rel="noopener">
            SignIn
          </a>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4">
        <p className="text-muted-foreground text-left">
          Trackit will still work but you won't be able to decide the group to
          which it will be saved automatically. Please sign in to get the most
          out of Trackit.
        </p>
      </CardContent>
    </Card>
  );
}
