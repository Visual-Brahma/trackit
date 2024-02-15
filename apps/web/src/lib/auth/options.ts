import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { KyselyAdapter } from "@/lib/db/adapter"
import { dbClient } from "@/lib/db/db_client"
import EmailProvider from "next-auth/providers/email"
import environmentVariables from "@/config/environment"
import { render } from "@react-email/render"
import MagicLinkEmail from "@/emails/magic-link-email"
import { sendEmail } from "@/emails"
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
            server: {
                host: environmentVariables.email.host,
                port: environmentVariables.email.port,
                auth: {
                    user: environmentVariables.email.user,
                    pass: environmentVariables.email.password,
                },
            },
            async sendVerificationRequest(params) {
                const { identifier, url, provider, theme }=params;
                const { host }=new URL(url);

                const escapedHost=host.replace(/\./g, "&#8203;.");

                const html=render(MagicLinkEmail({ url, host: escapedHost }));
                const text=render(MagicLinkEmail({ url, host: escapedHost }), { plainText: true });

                await sendEmail({
                    to: identifier,
                    from: provider.from,
                    subject: `Your ${appName} Login Link`,
                    html: html,
                    text: text,
                });
            },
        }),
        GoogleProvider({
            clientId: environmentVariables.auth.google.clientId,
            clientSecret: environmentVariables.auth.google.clientSecret,
        }),
    ],
}