import { Router } from "express";
import { adminAuth } from "../middlewares/auth";
import { addCategories, getCategories, deleteCategories } from "../controllers/categories";

const router = Router();

router.post("/add", addCategories),
router.get("/get", getCategories),
router.delete("/delete", deleteCategories)

export  {router as CategoryRoute};