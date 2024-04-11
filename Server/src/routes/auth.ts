import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/auth";
import { adminAuth, userAuth } from "../middlewares/auth";
import { registerUser } from "../controllers/authUser";
import { orderFromRFID } from "../controllers/orders";

const router = Router();

router.post("/login", loginAdmin)
router.post("/register", registerAdmin)
router.post("/registerUser",adminAuth, registerUser)

// router.get("/logout",)

export  {router as AuthRoutes};