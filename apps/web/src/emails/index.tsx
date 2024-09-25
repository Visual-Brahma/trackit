import { serverEnv } from "@/config/env/server";
import Plunk from "@plunk/node";

export const plunk = new Plunk(serverEnv.PLUNK_API_KEY);
