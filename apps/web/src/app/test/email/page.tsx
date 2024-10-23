import { render } from "@react-email/render";
import PreviewEmailTemplate from "./preview-email";
import MagicLinkEmail from "@/emails/magic-link-email";

const PreviewEmail = () => {
  const emailTemplates: {
    id: string;
    name: string;
    email: string;
  }[] = [
    {
      id: "magic-link",
      name: "Magic Link",
      email: render(
        <MagicLinkEmail url="https://trackit.visualbrahma.tech/some-verification-url" />,
        {
          pretty: true,
        },
      ),
    },
  ];

  return (
    <div>
      <h1>Preview Email</h1>
      <PreviewEmailTemplate emailTemplates={emailTemplates} />
    </div>
  );
};

export default PreviewEmail;
