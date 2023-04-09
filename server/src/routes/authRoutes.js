import express from "express";
import { registerUser,getUserCredentials } from "../controllers/auth.js";

const router =  express.Router();

router.post("/user/signup",registerUser);
router.post("/user/login",getUserCredentials);

export default router;
