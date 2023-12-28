import cors from "cors";
import express from "express";
import session from "express-session";
import router from "@/routes/index.routes";
import environmentVariables from "./config/environment";
import { sessionConfig } from "@/middleware/session_manager";
import authManager, { accessCodeVerifier, corsConfig } from "@/middleware/auth_manager";

const app = express();

// Request Body Parser
app.use(express.json());

// CORS 
app.use(cors(corsConfig));

// authorization
app.use(accessCodeVerifier);
app.use(authManager);

// Session
app.use(session(sessionConfig));

// Router
app.use(router);

app.listen(
  environmentVariables.port,
  () => console.log("Server is up and running.")
);