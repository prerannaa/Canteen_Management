import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import db from "../database/connection";
import { categories } from "../model/schema";
import { eq, ilike } from "drizzle-orm";

export const addCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.body?.id;
    const name = req.body?.name;
    const now = new Date();
    const addedById = req.admin.id;

    if (!name) {
      throw new AppError(400, "Invalid details provided");
    }

    const existingCategory = await db
      .select()
      .from(categories)
      .where(ilike(categories.name, name));
    if (existingCategory.length > 0) {
      res.status(400).send({ message: "This category already exists" });
      return;
    }

    const newCategory = await db.insert(categories).values({
      id,
      name,
      addedById,
      createdAt: now,
    });

    console.log("category:", newCategory);

    if (!newCategory) {
      throw new AppError(400, "Failed to create a new category. Try Again");
    }
    res.send(201).send({
      message: "New category successfully added",
      success: true,
      data: newCategory,
    });
  } catch (error) {}
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allCategories = await db.select().from(categories);
    const categoryNames = allCategories.map(({ name }) => name);

    res.status(200).send({
      message: "All Categories",
      data: categoryNames,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching category" });
    console.log(error);
  }
};

export const deleteCategories = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
    const category = req.body.name// Get user ID from request parameter
    if (!category ) {
      throw new Error('Missing category name in request');
    }

    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category));

    if (existingCategory.length === 0) {
      res.status(404).send({ message: 'Category not found' });
      return;
    }

    await db.delete(categories).where(eq(categories.name, category));
    res.status(200).send({ message: 'Category deleted successfully' });
  }
  catch(error){
    console.log(error)
  }
}
