import { Router } from "express";
import { getUser, loginUser } from "../controllers/authUser";
import {  userAuth } from "../middlewares/auth";
import { orderFromRFID, orderWithoutRFID } from "../controllers/orders";
const router = Router();

router.post("/login",  loginUser);
router.get("/getuser", userAuth, getUser);
router.post("/order", userAuth, orderFromRFID);
router.post("/orderwithoutrfid", orderWithoutRFID)


export  {router as AuthUserRoutes};