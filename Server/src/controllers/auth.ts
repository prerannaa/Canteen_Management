import { Request, Response, NextFunction } from "express";
import { admin } from "../model/schema";
import db from "../database/connection";
import { and, eq, ilike, max } from "drizzle-orm";
import bcrypt from "bcrypt";
import { AppError } from "../middlewares/errorHandler";
import { assignToken } from "../utils/jwt";

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fullName = req.body?.fullName;
    const password = req.body?.password;

    if (!fullName || !password) {
      throw new AppError(400, "fullname or password is incorrect");
    }

    const existingAdmin = await db
      .select()
      .from(admin)
      .where(ilike(admin.fullName, fullName));

    if (existingAdmin.length === 0) {
      throw new AppError(404, "Admin with this fullname does not exist");
    }

    const fetchedAdmin = existingAdmin[0];
    const passwordMatch = await bcrypt.compare(
      password,
      fetchedAdmin.password as string
    );

    if (!passwordMatch) {
      throw new AppError(401, "Invalid password");
    }

    const token = assignToken({ adminId: fetchedAdmin.id });
    const role = fetchedAdmin.role;

    res.status(201).send({
      message: "Admin logged in successfully",
      success: true,
      accessToken: {
        token,
        role: role || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.body?.id;
    const fullName = req.body?.fullName;
    const birthdate = req.body?.birthdate;
    const password = req.body?.password;
    const now = new Date();

    if (!fullName || !birthdate || !password) {
      throw new AppError(400, "Invalid details provided");
    }

    const existingAdmin = await db
      .select()
      .from(admin)
      .where(ilike(admin.fullName, fullName));
    if (existingAdmin.length > 0) {
      res
        .status(400)
        .send({ message: "Admin with this fullname already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = 'admin';
    const newAdminUser = await db.insert(admin).values({
      id,
      fullName,
      birthdate,
      password: hashedPassword,
      role,
      createdAt: now,
    });

    if (!newAdminUser) {
      throw new AppError(400, "Failed to create a new user. Try Again");
    }

    const newAdminId = await db.select({ value: max(admin.id) }).from(admin);
    const newAdminIdValue = newAdminId[0].value; // Extract ID value

    const token = assignToken({ id: newAdminIdValue });

    res.status(201).send({
      message: "Admin registered successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, fullName } = req.admin;
    const userAdmin = await db
      .select()
      .from(admin)
      .where(and(eq(admin.id, id), eq(admin.fullName, fullName)));

    if (!userAdmin) {
      throw new AppError(401, "Admin does not exist");
    }
    res.status(200).send({
      message: "User Details",
      success: true,
      data: userAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, fullName } = req.admin;
    const { fullName: updatedFullName } = req.body;

    if (!fullName) {
      throw new AppError(400, "No admin user details to update");
    }

    const updatedAdmin = await db
      .update(admin)
      .set({ fullName: updatedFullName })
      .where(eq(admin.id, id))
      .returning({ updatedName: admin.fullName }); // Return updated values
    const { updatedName } = updatedAdmin[0];
    console.log(updatedAdmin[0]);
    res.status(200).send({
      data: updatedName,
      success: true,
      message: "User successfully updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.admin;
    const deletedAdmin: { deletedId: number }[] = await db
      .delete(admin)
      .where(eq(admin.id, id ))
      .returning({ deletedId: admin.id });
    if (deletedAdmin) {
      res.status(200).send({
        message: "Admin deleted successfully",
        success: true,
      });
    } else {
      throw new AppError(404, "Admin not found");
    }
  } catch (error) {
    next(error)
  }
};

