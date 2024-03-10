import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { KyselyAdapter } from "@/lib/db/adapter"
import { dbClient } from "@/lib/db/db_client"
import EmailProvider from "next-auth/providers/email"
import environmentVariables from "@/config/environment"
import { render } from "@react-email/render"
import MagicLinkEmail from "@/emails/magic-link-email"
import { plunk } from "@/emails"
import { appName } from "../constants/brand"

export const authOptions: NextAuthOptions={
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
                const { identifier, url }=params;
                const { host }=new URL(url);

                const escapedHost=host.replace(/\./g, "&#8203;.");

                const html=render(MagicLinkEmail({ url, host: escapedHost }));

                await plunk.emails.send({
                    to: identifier,
                    subject: `Your ${appName} Login Link`,
                    body: html,
                });
            },
        }),
        GoogleProvider({
            clientId: environmentVariables.auth.google.clientId,
            clientSecret: environmentVariables.auth.google.clientSecret,
            allowDangerousEmailAccountLinking: true
        }),
    ],
}