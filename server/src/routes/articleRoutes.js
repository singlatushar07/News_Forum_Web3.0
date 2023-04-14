import { addArticle ,getArticle} from "../controllers/article.js";
import express from "express"

const router = express.Router();
router.post("/addArticle",addArticle);
router.post("/get/article",getArticle)
export default router;
