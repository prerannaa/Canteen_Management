import { Request, Response, NextFunction } from "express";
import db from "../database/connection";
import { users } from "../model/schema";
import { AppError } from "../middlewares/errorHandler";
import { eq, ilike, max } from "drizzle-orm";
import { assignToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { User } from "../interfaces/users";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.body?.id;
    const fullName = req.body?.fullName;
    const birthdate = req.body?.birthdate;
    const password = req.body?.password;
    const balance = req.body?.balance;
    const role = req.body?.role;
    const now = new Date();
    const createdBy = req.admin.id;

    if (!fullName || !birthdate || !password) {
      throw new AppError(400, "Invalid details provided");
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(ilike(users.fullName, fullName));
    if (existingUser.length > 0) {
      res
        .status(400)
        .send({ message: "User with this fullname already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.insert(users).values({
      id,
      fullName,
      birthdate,
      password: hashedPassword,
      balance,
      role,
      createdBy,
      createdAt: now,
    });

    if (!newUser) {
      throw new AppError(400, "Failed to create a new user. Try Again");
    }

    const newUserId = await db.select({ value: max(users.id) }).from(users);
    const newUserIdValue = newUserId[0].value; // Extract ID value

    const token = assignToken({ id: newUserIdValue });

    res.status(201).send({
      message: "User registered successfully by admin",
      success: true,
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fullName = req.body?.fullName;
    const password = req.body?.password;

    if (!fullName || !password) {
      throw new AppError(400, "Fullname or password is incorrect");
    }
    const existingUser = await db
      .select()
      .from(users)
      .where(ilike(users.fullName, fullName));

    if (existingUser.length === 0) {
      throw new AppError(404, "User with this fullname does not exist");
    }

    const fetchedUser = existingUser[0];
    const passwordMatch = await bcrypt.compare(
      password,
      fetchedUser.password as string
    );
    if (!passwordMatch) {
      throw new AppError(401, "Invalid password");
    }
    const token = assignToken({ userId: fetchedUser.id });
    const role = fetchedUser.role;
    res.status(201).send({
      message: "User logged in successfully",
      success: true,
      accessToken: {
        token,
        role: role || null,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchedUsers = await db.select().from(users);
    res.status(200).send(fetchedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching users" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const fullName = req.body.fullName;
    const birthdate = req.body.birthdate;
    const balance = req.body.balance;
    const role = req.body.role;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.fullName, fullName));

    if (existingUser.length === 0) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    const updatedUser = await db
      .update(users)
      .set({
        fullName: fullName || existingUser[0].fullName,
        birthdate: birthdate || existingUser[0].birthdate,
        balance: balance || existingUser[0].balance,
        role: role || existingUser[0].balance,
      })
      .where(eq(users.fullName, fullName));

    if (updatedUser.count === 0) {
      throw new Error('Failed to update user');
    }

    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userIdString  = req.params.userId// Get user ID from request parameter
    console.log("UserId", userIdString );
    if (!userIdString ) {
      throw new Error('Missing user ID in request');
    }

    // Convert user ID string to a number safely
    const userId: number = parseInt(userIdString , 10); // Use base 10 for decimal integers

    if (isNaN(userId)) {
      throw new Error('Invalid user ID format. Please provide a valid number.');
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser.length === 0) {
      res.status(404).send({ message: 'User not found' });
      return;
    }

    await db.delete(users).where(eq(users.id, userId));

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete user' });
  }
};

export const getUser = async(
  req: Request,
  res: Response,
) => {
  try{
    const user: User = req.user; 

    const userDetailsArray: User[] = [user]; // Convert single user to array

    // Extract the desired properties into a new array of objects
    const extractedUserDetails: { fullName: string; balance: number , role: string}[] = userDetailsArray.map(
      (user: User) => ({
        fullName: user.fullName,
        balance: user.balance,
        role: user.role,
      })
    );

    res.status(200).send(
      extractedUserDetails);
  }
  catch(error){
    console.log(error)
  }
}
