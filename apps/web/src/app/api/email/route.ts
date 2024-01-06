import { sendEmail } from "@/emails";
import ContactFormResponseEmail, { ContactFormRecievedResponseProps } from "@/emails/contact-form-response";
import { render } from "@react-email/render";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    if (!request.body) {
        return new Response("Missing body", { status: 400 });
    }

    const { to, template, data }=await request.json() as { to: string; template: string; data: object; };

    const emailOptions={
        to: to,
        subject: "",
        text: "",
        html: "",
    }

    let reactEmail: JSX.Element;
    switch (template) {
        case "contact-form-response":
            emailOptions.subject="Thank you for contacting us!";
            reactEmail=ContactFormResponseEmail(data as ContactFormRecievedResponseProps);
            break;
        default:
            return new Response("Unknown template", { status: 400 });
    }

    emailOptions.html=render(reactEmail, { pretty: true });
    emailOptions.text=render(reactEmail, { plainText: true });

    const emailStatus=await sendEmail(emailOptions);

    if (emailStatus) {
        return new Response("Email sent", { status: 200 });
    } else {
        return new Response("Email failed to send", { status: 500 });
    }
}