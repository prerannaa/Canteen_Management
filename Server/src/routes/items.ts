import { Router } from "express";
import { adminAuth } from "../middlewares/auth";
import { addItems, deleteItems, getItems } from "../controllers/items";

const router = Router();

router.post("/add", adminAuth, addItems),
router.get("/get", getItems),
router.delete("/delete", adminAuth, deleteItems )

export  {router as ItemsRoute};