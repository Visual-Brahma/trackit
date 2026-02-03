"use client";
import { createMeeting } from "@/lib/api/meetings";
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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next13-progressbar";

const FormSchema = z.object({
  name: z.string().min(2, { message: "Meeting name must be atleast 2 characters." }),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  agenda: z.string().optional(),
  meetLink: z.string().url().optional().or(z.literal("")),
});

export default function ScheduleMeetingModal({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "12:00",
      endTime: "13:00",
      agenda: "",
      meetLink: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const res = await createMeeting({
      groupId,
      name: data.name,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      agenda: data.agenda,
      meetLink: data.meetLink || undefined,
    });
    if (res.success) {
      toast.success(res.message);
      setIsOpen(false);
      form.reset();
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a new meeting for this group.
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
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Weekly Sync" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={"date"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name={"startTime"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name={"endTime"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"meetLink"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meet Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://meet.google.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={"agenda"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What's this meeting about?" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingCircle />
                  <span className="ml-2">Scheduling...</span>
                </>
              ) : (
                "Schedule"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
