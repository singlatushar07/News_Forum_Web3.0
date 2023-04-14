import express from "express";
import { registerUser,userLogin,ProfileChange } from "../controllers/auth.js";

const router =  express.Router();

router.post("/user/signup",registerUser);
router.post("/user/login",userLogin);
router.post("/user/update",ProfileChange);
export default router;
