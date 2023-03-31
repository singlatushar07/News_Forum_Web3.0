import { addArticle } from "../controllers/article.js";
import express from "express"

const router = express.Router();
router.post("/addArticle",addArticle);

export default router;
