"use client"
import { Dispatch, SetStateAction, useState } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";

const isValidEmail=(email: string) => /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);

interface EmailChipsInputProps {
    emails: string[];
    setEmails: Dispatch<SetStateAction<string[]>>;
}

const EmailChipsInput=({ emails, setEmails }: EmailChipsInputProps) => {
    const [input, setInput]=useState<string>("");
    const [error, setError]=useState<string|null>(null);

    const isValidInput=(input: string) => {
        let error=null;

        if (!isValidEmail(input)) {
            error=`${input} is not a valid email address.`;
        } else if (emails.includes(input)) {
            error=`${input} has already been added.`;
        }

        if (error) {
            setError(error);
            return false;
        } else {
            return true;
        }
    }

    const handleKeyDown=(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', 'Tab', ','].includes(e.key)) {
            e.preventDefault();
            var email=input.trim();

            if (email&&isValidInput(email)) {
                setEmails((emails) => [...emails, email]);
                setInput("");
            }
        }

    }
    return (
        <div className="w-full">
            <Input
                value={input}
                type="email"
                onChange={(e) => {
                    setInput(e.target.value);
                    setError(null);
                }}
                onKeyDown={handleKeyDown}
                className="w-full"
            />
            {
                error&&<p className="text-red-500">{error}</p>
            }
            {
                emails.map((email) => (
                    <Badge variant={"default"} className={`mr-2 my-1 rounded-xl`}>
                        {email}
                        <Button variant={"ghost"} className="ml-2 hover:bg-primary/80 rounded-full" size={"icon"} onClick={() =>
                            setEmails((emails) => {
                                return emails.filter((e) => e!==email);
                            })
                        }>
                            <CrossCircledIcon />
                        </Button>
                    </Badge>
                ))
            }
        </div>
    )
}

export { EmailChipsInput }