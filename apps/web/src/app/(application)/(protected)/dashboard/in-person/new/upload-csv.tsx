import { Dispatch, SetStateAction, useState } from "react";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@repo/ui/file-upload";
import { Paperclip } from "lucide-react";
import React from "react";
import { toast } from "@repo/ui/sonner";
import { z } from "zod";
import { parse } from "papaparse";

const FileSvgDraw = ({
  message = "Make sure there is a column containing emails.",
}: {
  message?: string;
}) => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">.csv</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </>
  );
};

const emailSchema = z.string().email().optional();

export const UploadEmailCsv = ({
  onComplete,
}: {
  onComplete: Dispatch<SetStateAction<string[]>>;
}) => {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
  };

  const handleUpload = async (values: File[] | null) => {
    if (!values || values.length == 0) {
      toast.error("Please select a file to upload");
      return;
    }

    const file = values[0]!;

    parse(file, {
      header: true,
      error: () => {
        toast.error(
          "Error extracting emails from file. Please make sure there is a column containing emails.",
        );
      },
      complete: (results) => {
        const csvColumns = results.meta.fields || [];

        if (csvColumns.length < 1) {
          toast.error("No columns found in the csv file");
          return;
        }

        const emailsColumn = csvColumns.find((col) =>
          results.data.some(
            (row: any) =>
              row[col] &&
              typeof row[col] === "string" &&
              emailSchema.safeParse(row[col]).success,
          ),
        );

        if (!emailsColumn) {
          toast.error("No valid emails found in the csv file");
          return;
        }

        const emailList = results.data
          .map((row: any) => row[emailsColumn])
          .filter((email: any): email is string => !!email);
        onComplete(emailList);
      },
    });
  };

  return (
    <FileUploader
      value={files}
      onValueChange={(value) => {
        setFiles(value);
        handleUpload(value);
      }}
      dropzoneOptions={dropZoneConfig}
      className="relative bg-background rounded-lg p-2"
    >
      <FileInput className="outline-dashed outline-1 outline-white">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          <FileSvgDraw />
        </div>
      </FileInput>
      <FileUploaderContent>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default UploadEmailCsv;
