import { TypographyH3 } from "@repo/ui/typography";

export const UpdateNotes = () => {
  return (
    <div className="mt-6 m-2 p-4 italic rounded-lg bg-secondary">
      <TypographyH3>Update Notes ( v2.0 )</TypographyH3>
      <ul className="prose ml-4 my-4 list-disc list-inside">
        <li>Attendance reports are now automatically sorted by date (latest one first).</li>
        <li>Added option to delete reports.</li>
        <li>Revamped UI</li>
        <li>Added option to set email notification preferences</li>
        <li>Improved performance</li>
      </ul>
    </div>
  );
};
