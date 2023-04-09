import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export const addArticle = async (req,res)=>{
    const {title, content,authorId} = req.body;
    try{
        let data = {
            title,
            content,
            authorId
            // created_at:new Date()
        }
        const new_article = await prisma.article.create({
            data
          });
          res.status(200).json({ result: new_article });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}