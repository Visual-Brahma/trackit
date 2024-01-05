"use client"

import { toast } from "sonner"
import * as z from "zod"


import { Button } from "@repo/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form"
import { Input } from "@repo/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
  firstname: z.string().min(2,{
    message: "first name must be at least 2 characters.",
  }).max(20,{
    message:"first name must be smaller than 20 chars"
  }),
  lastname: z.string().min(2,{
    message: "first name must be at least 2 characters.",
  }).max(20,{
    message:"first name must be smaller than 20 chars"
  }),
  subject: z.string().min(5,{
    message: "topic should at leat be of 5 chars"
  }),
  message: z.string().min(20,{message:"define your message at least in 20 words"}),
  mail: z.string().email()
})

export default function ContactUsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname:"",
      mail:"",
      subject:"",
      message:""
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("this message", {
      description: (
        <pre>
          you message has been sent 
        </pre>
      ),
    })
    
  }

  return (
    <div className="flex items-center justify-center my-20 ">
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl space-y-6 border-2 py-4 px-2">
            <div className="flex item-center justify-center my-12 gap-x-12 gap-y-6">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your first name here
                  </FormDescription>
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
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your last name here
                  </FormDescription>
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
                    <Input className="w-3/4 mx-16" placeholder="subject of your messsage" {...field} />
                  </FormControl>
                  <FormDescription>
                    enter the topic of your message
                  </FormDescription>
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
                    <Input className="w-3/4 mx-16" placeholder="abc@xyz.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    enter your email
                  </FormDescription>
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
                    <textarea className="flex h-27 w-3/4 mx-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"  placeholder="enter your message" {...field} />
                  </FormControl>
                  <FormDescription>
                    enter your querry here
                  </FormDescription>
                  <FormMessage />
                </FormItem>


              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
  )
}
