import { TypographyP } from "@repo/ui/typography";

export const UnAuthenticatedUserError = () => {
  return (
    <div>
      <TypographyP className="text-red-200">
        Sorry! You are not authenticated.
      </TypographyP>
    </div>
  );
};
