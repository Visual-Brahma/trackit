import environmentVariables from "@/utils/config";
import prisma from "@/utils/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleAuthProvider from "next-auth/providers/google";
import customSendVerificationRequest from "./signinemail";

export const authOptions: AuthOptions={
    providers: [
        EmailProvider({
            from: environmentVariables.teamEmail,
            server: {
                host: environmentVariables.emailHost,
                port: environmentVariables.emailPort,
                auth: {
                    user: environmentVariables.emailUser,
                    pass: environmentVariables.emailPassword
                }
            },
            sendVerificationRequest: customSendVerificationRequest,
        }),
        GoogleAuthProvider({
            clientId: environmentVariables.googleOauthClientId,
            clientSecret: environmentVariables.googleOauthClientSecret,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    theme: {
        logo: "/logo.png",
        brandColor: "#6B13FA",
    }
}

export default NextAuth(authOptions);