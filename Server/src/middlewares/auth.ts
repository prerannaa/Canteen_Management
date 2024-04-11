import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { verifyToken } from "../utils/jwt";
import { admin, users } from "../model/schema";
import db from "../database/connection";
import { eq } from "drizzle-orm";

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header?.startsWith("Bearer")) {
      next(new AppError(401, "Unauthorized: Admin user is not authorized"));
    }
    const token = header?.split(" ")[1];
    const payload: any = verifyToken(token) as { adminId: string };
    const adminUser = await db.select()
      .from(admin)
      .where(eq(admin.id, payload.adminId));
    if (!adminUser) {
      next(new AppError(401, "Unauthorized: Admin user not found"));
    }
    //Attach admin from db to the req interface
    (req as any).admin = adminUser[0];
    next();
  } catch (error) {
    next(new AppError(401, "Admin user is not authorized"));
  }
};

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      next(new AppError(401, "Unauthorized: User is not authorized"));
    }
    const token = header?.split(" ")[1];
    const payload: any = verifyToken(token);
    const user = await db.select()
      .from(users)
      .where(eq(users.id, payload.userId));
    if (!user) {
      next(new AppError(401, "Unauthorized: User not found"));
    }

    //Attach user from db to the req interface
    (req as any).user = user[0];
    next();
  } catch (error) {
    next(new AppError(401, "User is not authorized"));
  }
};