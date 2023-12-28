import { Router } from "express";
import apiRoutes from "./api.routes";
import { API_VERSION } from "../config";

const router:Router = Router();

router.use(`/api/${API_VERSION}`, apiRoutes);

export default router;