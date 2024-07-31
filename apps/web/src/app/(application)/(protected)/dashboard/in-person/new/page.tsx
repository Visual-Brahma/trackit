"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { LoadingCircle } from "@repo/ui/icons";
import { Input } from "@repo/ui/input";
import { EmailChipsInput } from "@repo/ui/email-chips-input";
import { createInPersonAttendanceLink } from "@/lib/api/in-person";
import { toast } from "@repo/ui/sonner";
import Link from "next/link";
import { TypographyP } from "@repo/ui/typography";
import { useState } from "react";
import UploadEmailCsv from "./upload-csv";

const FormSchema = z.object({
  name: z.string().min(2),
  venue: z.string().optional(),
  allowedEmailDomains: z.array(z.string()).default([]),
  allowedEmails: z.array(z.string()).default([]),
});

export default function CreateInPersonAttendanceLinkForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      allowedEmailDomains: [],
      allowedEmails: [],
    },
  });

  const { isSubmitting, isValidating } = form.formState;
  const [slug, setSlug] = useState<string | null>(null);

  const isLoading = isSubmitting || isValidating;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const timeStamp = new Date().toISOString();
    const res = await createInPersonAttendanceLink({
      ...data,
      date: timeStamp,
      startTime: timeStamp,
    });

    if (res === false) {
      toast.error("Failed to create attendance link");
    } else {
      toast.success("Attendance link created successfully");
      setSlug(res);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-4 mt-6">
      {slug && (
        <Card className="w-full max-w-lg">
          <CardContent className="mt-4 flex items-center justify-between gap-2">
            <TypographyP>Attendance Link created successfully.</TypographyP>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Button
                variant={"secondary"}
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${location.origin}/in-person/${slug}`
                  );
                  toast.success("Link copied to clipboard");
                }}
              >
                Share
              </Button>
              <Link
                href={`/dashboard/in-person/${slug}`}
                className={buttonVariants()}
              >
                View
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className={"w-full max-w-lg border-none"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Create Attendance Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Event Name e.g. 'Tech Meetup'"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"venue"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Venue e.g. 'Apple Park'"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"allowedEmailDomains"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Email Domains</FormLabel>
                    <FormControl>
                      <EmailChipsInput
                        domainOnly
                        emails={field.value}
                        setEmails={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Only users with emails from these domains will be allowed
                      to check-in. Leave empty to allow all domains.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"allowedEmails"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Emails</FormLabel>
                    <FormControl>
                      <div>
                        <EmailChipsInput
                          emails={field.value}
                          setEmails={field.onChange}
                        />
                        <TypographyP className="my-2 text-center">
                          Or
                        </TypographyP>
                        <UploadEmailCsv onComplete={field.onChange} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Only users with these emails will be allowed to check-in.
                      This will override the allowed email domains. Leave empty
                      to allow anyone.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button disabled={isLoading}>
                {isLoading ? <LoadingCircle /> : "Create"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
