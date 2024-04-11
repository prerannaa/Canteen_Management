import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import db from "../database/connection";
import {
  inventory,
  items,
  itemsOnInventory,
  orders,
  users,
} from "../model/schema";
import { eq, ilike, sql } from "drizzle-orm";
import { OrderPartial } from "../interfaces/orders";

export const orderFromRFID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, totalPrice } = req.body;
    const userId = req.user.id;
    const now = new Date();
    console.log(req.body);

    // 1. Validate request body:
    if (!totalPrice || !quantity) {
      throw new AppError(400, "Invalid request: Missing required fields");
    }

    // 2. Check user's balance:
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    const balance = user.balance as string;

    if (balance <= totalPrice) {
      throw new AppError(
        402,
        "Insufficient balance. Please top up your account."
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          balance: sql`${users.balance} - ${totalPrice}`,
        })
        .where(eq(users.id, userId));
      console.log(balance);

      const order = await db.insert(orders).values({
        userId,
        quantity,
        totalPrice,
        remarks : "ONLINE",
        createdAt: now,
      });
      console.log("New Balance", users.balance);
    });
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const orderWithoutRFID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log( req.body);
    const { itemId, remarks= "CASH" } = req.body;
    if (!itemId) {
      throw new Error('Missing required "itemId" in request body');
    }

    const newOrder: OrderPartial = { itemId, remarks };
    const orderedItem = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId));
    let orderedPrice = orderedItem[0].price || 0;
    const ingredientList = orderedItem[0].ingredients as any; // Access the ingredients objec

    if (ingredientList.length === 0) {
      throw new Error("No item found with the provided ID");
    }

    const ingredientObject: { [key: string]: number } = orderedItem[0]
      .ingredients as any; 

    const ingredientMap: any = new Map<string, number>(
      Object.entries(ingredientObject) as [string, number][]
    );

    console.log("ingredientMap", ingredientMap)

    const inventoryData = await db
      .select({
        name: inventory.name,
        quantity: inventory.quantity,
        price: inventory.price
      })
      .from(inventory);

    const inventoryNameSet: any = new Set(inventoryData.map((item) => item.name)); 


    let canCreateOrder = true;

    for (const [ingredientName, quantity, price] of ingredientMap.entries()) {
      let inventoryQuantity = inventoryData.find(item => item.name === ingredientName)?.quantity || 0;
      if ((!inventoryNameSet.has(ingredientName)) || (inventoryQuantity <= quantity)) {
        console.log(`Ingredient '${ingredientName}' not found in inventory`);
        canCreateOrder = false;
      } else {
        console.log(`Ingredient '${ingredientName}' found in inventory`);
      }
    }
    if (canCreateOrder) {
      await db.insert(orders).values(newOrder);
      for (const [ingredientName, orderedQuantity] of ingredientMap.entries()) {
        const inventoryItem = inventoryData.find(item => item.name === ingredientName);
        if (inventoryItem) {
          const newInventoryQuantity = inventoryItem.quantity - orderedQuantity;
          const newInventoryPrice = parseFloat(inventoryItem.price) - orderedPrice;
          await db
            .update(inventory)
            .set({ quantity: newInventoryQuantity, price: sql`${newInventoryPrice}` })
            .where(eq(inventory.name, inventoryItem.name));
          console.log(`Updated inventory for '${ingredientName}': new quantity is ${newInventoryQuantity}`);
          console.log(`Updated inventory for '${ingredientName}': new price is ${newInventoryPrice}`);

        } else {
          console.error(`Failed to find inventory item for '${ingredientName}' during update`);
        }
      }
      res.status(201).json({ message: "Order created successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Order cannot be created: Missing ingredients" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating order", error });
  }
};


export const getTransaction = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
      const fetchedTransactions = await db.select().from(orders);
      res.status(200).send(fetchedTransactions);
  }
  catch(error){
      res.status(500).send({ message: "Error fetching transactions" });
      console.log(error)
  }
}