import { Router } from "express";
import { deleteAdmin, getAdmin, updateAdmin } from "../controllers/auth";
import { addIngredients, getInventoryList } from "../controllers/inventory";
import { getTransaction } from "../controllers/orders";
import { adminAuth } from "../middlewares/auth";

const router = Router();

router.get("/get",getAdmin);
router.put("/put", updateAdmin);
router.delete("/delete", deleteAdmin);
router.post("/addingredient", adminAuth, addIngredients);
router.get("/transactions", getTransaction);
router.get("/inventory", getInventoryList)

export  {router as AdminRoutes};