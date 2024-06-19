import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../routers/auth.router.js";
import { ApiError } from "../exceptions/index.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(ApiError.unauthorizedError());

    const token = authHeader.split(" ")[1];
    if (!authHeader) return next(ApiError.unauthorizedError());

    const tokenData = verifyToken(token);
    if (!tokenData) return next(ApiError.unauthorizedError());

    req.body.user = tokenData;
    next();
  } catch (error) {
    return next(ApiError.unauthorizedError());
  }
}
