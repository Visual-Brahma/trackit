import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { KyselyAdapter } from "@/lib/db/adapter"
import { dbClient } from "@/lib/db/db_client"
import EmailProvider from "next-auth/providers/email"
import environmentVariables from "@/config/environment"

export const authOptions: AuthOptions={
    adapter: KyselyAdapter(dbClient),
    providers: [
        EmailProvider({
            server: {
                host: environmentVariables.email.host,
                port: environmentVariables.email.port,
                auth: {
                    user: environmentVariables.email.user,
                    pass: environmentVariables.email.password,
                },
            }
        }),
        GoogleProvider({
            clientId: environmentVariables.auth.google.clientId,
            clientSecret: environmentVariables.auth.google.clientSecret,
        }),
    ],
}