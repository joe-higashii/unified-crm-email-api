//errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { APIError } from '../errors/APIError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.code || 500,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userGuidance: err.userGuidance || "Entre em contato com o suporte se o problema persistir.",
    timestamp: new Date().toISOString(),
  });

  if (err instanceof APIError) {
    res.status(err.code).json({
      error: err.message,
      guidance: err.userGuidance,
      docs: "/api-docs/errors",
    });
    return;
  }
  res.status(500).json({
    error: "Erro interno no servidor.",
    guidance: "Entre em contato com o suporte se o problema persistir.",
    docs: "/api-docs/errors#500",
  });
};

