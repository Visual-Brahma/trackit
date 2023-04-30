import environmentVariables from "@/utils/config";
import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleAuthProvider from "next-auth/providers/google";

export const authOptions: AuthOptions={
    providers: [
        GoogleAuthProvider({
            clientId: environmentVariables.googleOauthClientId,
            clientSecret: environmentVariables.googleOauthClientSecret,
        }),
        EmailProvider({
            from: environmentVariables.teamEmail,
            server: {
                host: environmentVariables.emailHost,
            }
        })
    ],
}

export default NextAuth(authOptions);