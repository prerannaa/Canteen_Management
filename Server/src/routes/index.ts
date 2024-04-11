import { Router } from "express";
import { AuthRoutes } from "./auth";
import { adminAuth, userAuth } from "../middlewares/auth";
import { AdminRoutes } from "./admin";
import { AuthUserRoutes } from "./authUsers";
import { UserRoutes } from "./users";
import { getUser } from "../controllers/authUser";
import { CategoryRoute } from "./categories";
import { ItemsRoute } from "./items";


const router = Router();

router.use("/auth", AuthRoutes);
router.use("/authuser", AuthUserRoutes);
router.use("/admin",  AdminRoutes);
router.use("/users", UserRoutes);
router.use("/category", CategoryRoute);
router.use("/items", ItemsRoute);


export default router;