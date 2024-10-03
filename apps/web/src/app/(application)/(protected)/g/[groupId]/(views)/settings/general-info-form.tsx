"use client";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { PencilIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/input";
import { useRouter } from "next13-progressbar";
import { LoadingCircle } from "@repo/ui/icons";
import { Textarea } from "@repo/ui/textarea";
import { toast } from "@repo/ui/sonner";
import { updateGroupGeneralSettings } from "@/lib/api/groups/settings";
import { Switch } from "@repo/ui/switch";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Group name must be atleast 2 characters." })
    .max(50, { message: "Group name can't be longer than 50 characters." }),
  description: z
    .string()
    .max(500, { message: "Description can't be longer than 500 characters." })
    .optional()
    .default(""),
  allowNewMembers: z.boolean(),
});

export default function GroupGeneralSettings({
  name,
  description,
  allowNewMembers,
  groupId,
}: {
  name: string;
  description: string;
  allowNewMembers: boolean;
  groupId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name,
      description,
      allowNewMembers,
    },
  });

  const formChanged = form.formState.isDirty;
  const reset = form.reset;

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    setIsLoading(true);
    const res = await updateGroupGeneralSettings({
      ...data,
      groupId,
    });
    if (res) {
      toast.success("Group settings updated successfully");
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error("Failed to update group settings, please try again");
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className={"mt-4"}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      <Card className="rounded-2xl shadow-xl overflow-hidden bg-secondary/40">
        <CardHeader className="flex flex-row justify-between gap-2 items-center">
          <CardTitle>General Settings</CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="mb-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Group Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What do you want to name your group?"
                        value={field.value}
                        onChange={field.onChange}
                        readOnly={!isEditing}
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
                    <FormLabel className="font-bold">
                      What's the Group is about?
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your group in a few words e.g AI/ML Class of 2023"
                        value={field.value}
                        onChange={field.onChange}
                        maxLength={500}
                        readOnly={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"allowNewMembers"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Allow New Members
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between space-x-2">
                        <FormDescription>
                          Allow new members to join with the join code
                        </FormDescription>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 items-center mt-2">
                  <Button
                    type="button"
                    variant={"ghost"}
                    onClick={() => {
                      reset();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !formChanged}>
                    {isLoading ? (
                      <LoadingCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <SaveIcon className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
