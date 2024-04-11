import { Request, Response, NextFunction } from "express";
import db from "../database/connection";
import { AppError } from "../middlewares/errorHandler";
import { categories, items } from "../model/schema";
import { eq, name, sql } from "drizzle-orm";
import { error } from "console";

export const addItems = async( 
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = req.body?.id;
        const name = req.body?.name;
        const category = req.body?.category;
        const price = req.body?.price;
        // const ingredients = req.body?.ingredients;
        const now = new Date();
        const addedById = req.admin.id;

        if(!name && !category && !price){
            throw new AppError(400,"Missing required fields: name and categoryId");
        }

        // const existingCategory = await db.select().from(categories).where(eq(categories.id, categoryId));
        // if (existingCategory.length === 0){
        //     throw new AppError(400, "Invalid category ID");
        // }

        const existingItems = await db.select().from(items).where(eq(items.name, name));
        if( existingItems.length > 0){
            return res.status(400).send({ message: "An item with this name already exists" });
        }

        // const categoryName = existingCategory[0].name;
        
        const newItem = await db.insert(items).values({
            id,
            name,
            categoryType: category,
            price,
            // ingredients : sql`${ingredients} :: json`,
            addedById,
            createdAt: now,
        });

        if (!newItem) {
          return res
            .status(500)
            .send({ message: "Failed to create a new item" }); // 500 for internal server error
        }

        res.status(201).send({
            message: "Item added successfully",
            success: true,
            data: {
                ...newItem,
                category,
            },
        });
    }
    catch(error){
        console.log(error);
    }
}



export const getItems = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const fetchedItems = await db.select().from(items);
        res.status(200).send(fetchedItems);
    }
    catch(error){
        res.status(500).send({ message: "Error fetching items" });
        console.log(error)
    }
}

export const deleteItems = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const itemId = req.body.id
        if(!itemId){
            // throw new Error("Missing items name in request");
            console.log(error)
        }

        const existingItems = await db.select().from(items).where(eq(items.id, itemId));

        if(existingItems.length === 0){
            res.status(404).send({
                message: "Item not found",
            });
            return;
        }
        await db.delete(items).where(eq(items.id, itemId));
        res.status(200).send({messge: 'Item deleted successfully'});

    }
    catch(error){
        next(error)
    }
}

