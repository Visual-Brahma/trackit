import type { SessionOptions } from "express-session";
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import environmentVariables from "@/config/environment";
import { pgPool } from "@/utils/db_client";

const pgSessionStore = pgSession(session);
export const sessionStore = new pgSessionStore({
    pool: pgPool,
    tableName: 'user_sessions',
});

export const sessionConfig: SessionOptions = {
    name: "SESS_ID",
    secret: environmentVariables.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: environmentVariables.nodeEnv === "production",
    },
    store: sessionStore
};