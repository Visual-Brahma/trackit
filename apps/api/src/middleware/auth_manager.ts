import type { NextFunction, Request, Response } from "express";
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import environmentVariables from "../config/environment";
import { CorsOptions } from "cors";
import { apiResponse } from "@/utils/response_format";

export const accessCodeVerifier=auth({
    audience: environmentVariables.auth0ApiIdentifier,
    issuerBaseURL: `https://${environmentVariables.auth0Domain}/`,
});

export const checkScopes=(scopes: string|string[]) => requiredScopes(scopes);

const authManager=async (req: Request, res: Response, next: NextFunction) => {

    const { authorization }=req.headers;

    if (!authorization) {
        return res.status(400).json(apiResponse({ success: false, error: "Authorization header missing." }));
    }

    try {
        const token=authorization?.split(" ")[1];

        if (!token) return res.status(400).json(apiResponse({ success: false, error: "user access_token missing." }));

        // TODO: Add logic to get user details from auth0 /userinfo endpoint.
        const payload= {username: "testuser"};

        req.user={
            username: payload.username
        };

        /* 
            TODO: Add logic to check if user is active.
             ```
                const accountDeletionRequest=await dbClient.selectFrom("AccountDeletionRequest").innerJoin('User', 'User.id', 'AccountDeletionRequest.userId').where('User.username', '=', payload.username);

                if (accountDeletionRequest&&req.path!="/api/v1/user/recover-account") {
                    return res.status(403).json({ error: "The account is requested for deletion, please recover it to continue to Befikra.", accountStatus: "DELETION_REQUEST" });
                }
            ```
        */

        next();

    } catch (error: any) {
        console.log(error);
        return res.status(401).json(apiResponse({ success: false, error: "Unauthorised" }));
    }

};

const whiteListDomains: (string|RegExp)[]=[/(?:[a-z0-9-]+\.)?visualbrahma\.tech$/i];

if (environmentVariables.nodeEnv==="development") {
    whiteListDomains.push("http://localhost:3000");
}

export const corsConfig: CorsOptions={
    origin: (origin, callback) => {
        if (!origin||whiteListDomains.indexOf(origin)!==-1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

export default authManager;