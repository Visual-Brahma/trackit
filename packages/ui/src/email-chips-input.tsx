"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";

const isValidEmail = (email: string) =>
  /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);

const isValidEmailDomain = (domain: string) =>
  /^[\w\d.-]+\.[\w\d.-]+/.test(domain);

interface EmailChipsInputProps {
  ignore?: string[];
  emails: string[];
  setEmails: Dispatch<SetStateAction<string[]>>;
  disabled?: boolean;
  domainOnly?: boolean;
}

const EmailChipsInput = ({
  emails,
  setEmails,
  ignore,
  disabled,
  domainOnly,
}: EmailChipsInputProps) => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const isValidInput = (input: string) => {
    let error = null;

    const isValid = domainOnly
      ? isValidEmailDomain(input)
      : isValidEmail(input);

    if (!isValid) {
      error = `${input} is not a valid email ${
        domainOnly ? "domain" : "address"
      }.`;
    } else if (emails.includes(input) || (ignore && ignore.includes(input))) {
      error = `${input} has already been added.`;
    }

    if (error) {
      setError(error);
      return false;
    } else {
      return true;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      var email = input.trim();

      if (email && isValidInput(email)) {
        setEmails([...emails, email]);
        setInput("");
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const emails = text.split(/[\s,;]+/);
    setEmails((prev) => {
      return [...prev, ...emails.filter((email) => isValidInput(email))];
    });
  };

  return (
    <div className="w-full">
      <Input
        disabled={disabled}
        value={input}
        type="email"
        onChange={(e) => {
          setInput(e.target.value);
          setError(null);
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-h-48 overflow-y-auto p-2 mt-2">
        {emails
          .slice()
          .reverse()
          .map((email) => (
            <Badge
              key={email}
              variant={"default"}
              className={`mr-2 my-1 rounded-xl`}
            >
              {email}
              <Button
                variant={"ghost"}
                className="ml-2 hover:bg-primary/80 rounded-full"
                size={"icon"}
                onClick={() =>
                  setEmails((emails) => {
                    return emails.filter((e) => e !== email);
                  })
                }
              >
                <CrossCircledIcon />
              </Button>
            </Badge>
          ))}
      </div>
    </div>
  );
};

export { EmailChipsInput };
