const environmentVariables={
    auth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        nextAuthSecret: process.env.NEXTAUTH_SECRET as string,
    },
    email: {
        host: process.env.EMAIL_HOST as string,
        port: parseInt(process.env.EMAIL_PORT as string),
        user: process.env.EMAIL_USER as string,
        password: process.env.EMAIL_PASSWORD as string,
    },
    baseUrl: process.env.BASE_URL as string,
    databaseUrl: process.env.DATABASE_URL as string,
}

export default environmentVariables;