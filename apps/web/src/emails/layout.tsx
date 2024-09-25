import { appName } from "@/lib/constants/brand";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import config from "../../tailwind.config";
import { LayoutProps } from "@/types";
import { clientEnv } from "@/config/env/client";

export interface EmailLayoutProps extends LayoutProps {
  previewText: string;
}

export const EmailLayout = ({ previewText, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={config}>
        <Body className="my-auto mx-auto font-sans p-4">
          <Container className="border border-solid border-[#eaeaea] rounded my-8 mx-auto p-8 w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${clientEnv.NEXT_PUBLIC_PRODUCTION_URL}/logo.svg`}
                width="40"
                height="37"
                alt={appName}
                className="my-0 mx-auto"
              />
            </Section>
            <Section className="px-8">{children}</Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailLayout;
