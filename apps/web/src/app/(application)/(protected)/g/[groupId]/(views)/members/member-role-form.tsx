"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@repo/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/dialog";
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
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { toast } from "@repo/ui/sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/database.types";
import { LoadingCircle } from "@repo/ui/icons";
import { changeUserRoleInGroup } from "@/lib/api/groups";

const roles = [Role.ADMIN, Role.MEMBER];
const FormSchema = z.object({
  role: z.enum(roles as [string, ...string[]]),
});

export default function MemberRoleForm({
  role,
  groupId,
  userId,
}: z.infer<typeof FormSchema> & {
  groupId: string;
  userId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.role === role) return;

    setIsLoading(true);
    const res = await changeUserRoleInGroup({
      groupId,
      userId,
      role: data.role,
    });
    if (!res) {
      toast.error("Failed to update permissions.");
    } else {
      toast.success("Access updated");
      setIsOpen(false);
      router.refresh();
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className={buttonVariants()}>
        <LockIcon className="mr-2 h-4 w-4" />
        <span>Manage Access</span>
      </DialogTrigger>
      <DialogContent>
        <Card className={"w-full max-w-lg border-none"}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Manage Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={"role"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((name) => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button>{isLoading ? <LoadingCircle /> : "Save"}</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
