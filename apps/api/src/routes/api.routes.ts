import { Response, Router } from "express";
import { API_VERSION } from "@/config";

const router: Router = Router();

router.get("/", (_, res: Response) => {
  res.send(`Trackit API ${API_VERSION}`);
});

export default router;