import express from "express";
import { registerUser,userLogin } from "../controllers/auth.js";

const router =  express.Router();

router.post("/user/signup",registerUser);
router.post("/user/login",userLogin);

export default router;
