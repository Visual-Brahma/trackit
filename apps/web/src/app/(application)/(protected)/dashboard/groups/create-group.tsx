"use client";
import { createGroup } from "@/lib/api/groups";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { LoadingCircle } from "@repo/ui/icons";
import { Input } from "@repo/ui/input";
import { toast } from "@repo/ui/sonner";
import { Textarea } from "@repo/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be atleast 2 characters." })
    .max(50, { message: "Name can't be longer than 50 characters." }),
  description: z.string().optional().default(""),
});

export default function CreateGroupModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [groupInfo, setGroupInfo] = useState<{
    id: string;
    joinCode: string;
  }>();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const res = await createGroup(data);
    if (res) {
      setGroupInfo(res);
      toast.success("Group created successfully.");
    } else {
      toast.error("Failed to create group. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent>
        {groupInfo ? (
          <>
            <DialogHeader>
              <DialogTitle>Group Created Successfully</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Share this code with others to add them to the group.
              </DialogDescription>
            </DialogHeader>
            <div className="text-center">
              <div className="p-4 rounded-lg my-4">
                <p className="font-semibold">Join Code:</p>
                <p className="text-lg">{groupInfo.joinCode}</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `Hey! Join my group on trackit using this code: ${groupInfo.joinCode}`,
                    );
                    toast.success("Join code copied to clipboard.");
                  }}
                >
                  Copy join code
                </Button>
                <Button asChild>
                  <Link href={`/g/${groupInfo.id}`}>View Group</Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group to organise attendance reports with same
                participants.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 my-4"
              >
                <FormField
                  control={form.control}
                  name={"name"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Group Name"
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
                  name={"description"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What's this group about? e.g Sales Team, Class 10A"
                          defaultValue={field.value}
                          onChange={field.onChange}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingCircle />
                      <span className="ml-2">Creating Group</span>
                    </>
                  ) : (
                    "Create Group"
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
