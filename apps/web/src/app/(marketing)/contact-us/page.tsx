"use client";
import { Button } from "@repo/ui/button";

export default function ContactUs() {
  return (
    <div className="flex mx-5 h-screen max-w-screen-xl items-center justify-between xl:mx-auto">
      <div className="mt-4">
        <h1
          className={
            "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md"
          }
        >
          Contact Us
        </h1>
        <p
          className={
            "text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 text-left"
          }
        >
          You can reach out to us anytime at{" "}
          <a
            href="mailto:teamtrackit@gmail.com"
            className={"text-primary underline-offset-4 hover:underline"}
          >
            teamtrackit@gmail.com
          </a>
          .
        </p>
        <div className="w-full flex items-center justify-start">
          <Button
            onClick={() => {
              window.tidioChatApi.display(true);
              window.tidioChatApi.open();
            }}
          >
            Chat Now
          </Button>
        </div>
      </div>
    </div>
  );
}
