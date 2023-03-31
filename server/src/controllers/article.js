import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const addArticle = async (req,res)=>{
    const {user_id,title, article} = req.body;
    try{
        let data = {
            user_id,
            title,
            article,
            created_at:new Date()
        }
        const new_article = await prisma.articles.create({
            data
          });
          res.status(200).json({ result: new_article });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}