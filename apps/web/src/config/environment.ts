const environmentVariables={
    logto: {
        endpoint: process.env.LOGTO_ENDPOINT as string,
        appId: process.env.LOGTO_APP_ID as string,
        appSecret: process.env.LOGTO_APP_SECRET as string,
        cookieSecret: process.env.LOGTO_COOKIE_SECRET as string,
    },
    email: {
        host: process.env.EMAIL_HOST as string,
        port: parseInt(process.env.EMAIL_PORT as string),
        user: process.env.EMAIL_USER as string,
        password: process.env.EMAIL_PASSWORD as string,
    },
    baseUrl: process.env.BASE_URL as string,
    nodeEnv: process.env.NODE_ENV||"production",
}

export default environmentVariables;