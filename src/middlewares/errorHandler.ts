//errorHandler.ts

import { Request, Response, NextFunction } from 'express';

export class APIError extends Error {
  public code: number;
  public userGuidance?: string;
  constructor(code: number, message: string, userGuidance?: string) {
    super(message);
    this.code = code;
    this.userGuidance = userGuidance;
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Erro capturado:', err);
  if (err instanceof APIError) {
    res.status(err.code).json({
      error: err.message,
      guidance: err.userGuidance,
      docs: '/api-docs/errors'
    });
    return;
  }
  res.status(500).json({
    error: 'Erro interno no servidor.',
    guidance: 'Entre em contato com o suporte se o problema persistir.',
    docs: '/api-docs/errors#500'
  });
  return;
};

