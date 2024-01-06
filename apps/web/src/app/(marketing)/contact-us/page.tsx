"use client"

import { toast } from "sonner"
import * as z from "zod"


import { Button } from "@repo/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@repo/ui/form"
import { Input } from "@repo/ui/input"
import { TypographyH1 } from "@repo/ui/typography"
import { Textarea } from "@repo/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"


const FormSchema=z.object({
  firstname: z.string().min(1, {
    message: "Is that really your name, just one character? stop kidding me.",
  }),
  lastname: z.string().optional(),
  subject: z.string().min(5, {
    message: "Please write a clear subject in at least 5 characters for our team to understand."
  }),
  message: z.string().min(20, { message: "define your message at least in 20 words" }),
  mail: z.string().email({message: "That's not an email, are you testing me? You can't fool me!"}),
})

export default function ContactUsForm() {
  const form=useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      mail: "",
      subject: "",
      message: ""
    },
  })

  const onSubmit=async (data: z.infer<typeof FormSchema>) => {
    try {
      const response=await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.mail,
          template: "contact-form-response",
          data: {
            firstname: data.firstname,
            subject: data.subject,
            message: data.message,
          }
        }),
      });
      if (response.ok) {
        toast.success('Your message has been sent successfully!');
      } else {
        const errorData=await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full p-4">
        <TypographyH1 className="mb-8">Contact US</TypographyH1>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full my-4 max-w-lg ring-2 ring-ring mx-auto rounded-lg p-4">
            <div className="w-full sm:flex sm:space-x-2 my-4 sm:item-center sm:justify-between">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="mt-6" placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="mt-6" placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="mt-6" placeholder="Subject of your messsage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="mt-6" placeholder="abc@xyz.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="mt-6" placeholder="Enter your message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-6" type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
