const environmentVariables={
    auth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        nextAuthSecret: process.env.NEXTAUTH_SECRET as string,
    },
    email: {
        plunkApiKey: process.env.PLUNK_API_KEY as string,
    },
    baseUrl: process.env.BASE_URL as string,
    databaseUrl: process.env.DATABASE_URL as string,
}

export default environmentVariables;