import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { KyselyAdapter } from "@/lib/db/adapter";
import { dbClient } from "@/lib/db/db_client";
import EmailProvider from "next-auth/providers/email";
import { render } from "@react-email/render";
import MagicLinkEmail from "@/emails/magic-link-email";
import { plunk } from "@/emails";
import { appName } from "../constants/brand";
import { serverEnv } from "@/config/env/server";

export const authOptions: NextAuthOptions = {
  adapter: KyselyAdapter(dbClient),
  session: {
    strategy: "jwt",
  },
  theme: {
    logo: "/logo.svg",
    brandColor: "#6B13FA",
  },
  providers: [
    EmailProvider({
      async sendVerificationRequest(params) {
        const { identifier, url } = params;
        const { host } = new URL(url);

        const escapedHost = host.replace(/\./g, "&#8203;.");

        const html = render(MagicLinkEmail({ url, host: escapedHost }));

        if (serverEnv.NODE_ENV === "development") {
          console.log(`Email verification link: ${url}`);
          return;
        }

        await plunk.emails.send({
          to: identifier,
          subject: `Your ${appName} Login Link`,
          body: html,
        });
      },
    }),
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
