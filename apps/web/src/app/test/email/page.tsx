import { render } from '@react-email/render'
import ContactFormResponseEmail from "@/emails/contact-form-response";
import PreviewEmailTemplate from "./preview-email";

const PreviewEmail=() => {

    const emailTemplates: {
        id: string;
        name: string;
        email: string;
    }[]=[
            {
                id: "contact-form-response",
                name: "Contact Form Response",
                email: render(<ContactFormResponseEmail firstName="Sarthak" subject="Just a test feedback" message="I just wanted to test if you guys really read these mails." />, {
                    pretty: true,
                })
            }
        ];

    return (
        <div>
            <h1>Preview Email</h1>
            <PreviewEmailTemplate emailTemplates={emailTemplates} />
        </div>
    )
}

export default PreviewEmail