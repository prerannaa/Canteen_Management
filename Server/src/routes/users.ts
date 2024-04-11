import { Router } from "express";
import { deleteUser, getAllUsers, updateUser } from "../controllers/authUser";
import { getTransaction } from "../controllers/orders";
import { userAuth } from "../middlewares/auth";
const router = Router();

router.get("/get", getAllUsers);
router.put("/put", updateUser );
router.get("/transactions", getTransaction);
router.delete("/delete/:userId", deleteUser);


export  {router as UserRoutes};