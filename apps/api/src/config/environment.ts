/**
 * Environment variables configuration
 */
import { config } from "dotenv";

if (process.env.NODE_ENV!=="production") {
    config();
}

const environmentVariables={
    port: process.env.PORT||8000,
    nodeEnv: process.env.NODE_ENV,
    sessionSecret: process.env.SESSION_SECRET as string,
    databaseUrl: process.env.DATABASE_URL,
    auth0Domain: process.env.AUTH0_DOMAIN as string,
    auth0ApiIdentifier: process.env.AUTH0_API_IDENTIFIER as string,
}

export default environmentVariables; 