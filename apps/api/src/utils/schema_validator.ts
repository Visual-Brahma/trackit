/**
 * Validate incoming request body with a schema.
 */
import type { NextFunction, Request, Response } from "express";
import { AnyObject } from "yup";
import { apiResponse } from "./response_format";

export const validate =
  (schema: AnyObject) => (req: Request, res: Response, next: NextFunction) => {
    schema
      .validate(req.body)
      .then(() => {
        next();
      })
      .catch((err: any) => {
        return res.status(400).json(apiResponse({ success: false, error: err.message }));
      });
  };

export default validate;