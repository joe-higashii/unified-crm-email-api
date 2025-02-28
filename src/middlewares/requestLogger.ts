//requestLogger.ts

import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });
  });
  next();
};

export default requestLogger;

