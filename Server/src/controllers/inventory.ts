import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import db from "../database/connection";
import { inventory } from "../model/schema";
import { eq } from "drizzle-orm";

export const addIngredients = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = req.body?.id;
        const name = req.body?.name;
        const price = req.body?.price;
        const quantity = req.body?.quantity;
        const now = new Date();

        if(!name && !price && !quantity){
            throw new AppError(400,"Missing required fields: name and price and quantity");
        }
        const existingIngredients = await db.select().from(inventory).where(eq(inventory.name, name));
        if( existingIngredients.length > 0){
            return res.status(400).send({ message: "An item with this name already exists" });
        }

        const newIngredient = await db.insert(inventory).values({
            id,
            name,
            price,
            quantity,
            createdAt: now,
        });

        if (!newIngredient) {
          return res
            .status(500)
            .send({ message: "Failed to create a new ingredient" }); // 500 for internal server error
        }

        res.status(201).send({
            message: "Ingredient added successfully",
            success: true,
            data: {
                ...newIngredient,
            },
        });
    }
    catch(error){
        console.log(error);
    }
}

export const getInventoryList = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
        const fetchedInventoryList = await db.select().from(inventory);
        res.status(200).send(fetchedInventoryList);
    }
    catch(error){
        res.status(500).send({ message: "Error fetching inventory list" });
        console.log(error)
    }
  }