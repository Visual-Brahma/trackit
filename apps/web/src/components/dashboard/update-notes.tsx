import { TypographyH3 } from "@repo/ui/typography";

const updates = [
  "Added In Person events attendance tracking feature",
  "Now you can download attendance reports in PDF format",
  "Attendance reports are now automatically sorted by date (latest one first).",
  "Added option to delete reports.",
  "Revamped UI",
  "Added option to set email notification preferences",
  "Improved performance",
];

export const UpdateNotes = () => {
  return (
    <div className="mt-6 m-2 p-4 italic rounded-lg bg-secondary">
      <TypographyH3>Update Notes ( v2.0 )</TypographyH3>
      <ul className="prose ml-4 my-4 list-disc list-inside">
        {updates.map((update) => (
          <li key={update}>{update}</li>
        ))}
      </ul>
    </div>
  );
};
