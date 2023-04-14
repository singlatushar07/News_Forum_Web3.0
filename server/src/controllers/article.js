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
export const getArticle = async ()=>{
    try {
        const {email,password} = req.body;
        const existing_user = await prisma.user.findUnique({
            where: { email },
          });
          if (!existing_user)
          return res.status(404).json({ message: "User doesn't exist" });
          if(!(existing_user.password === password)){
            return res.status(400).json({ message: "Invalid credentials" });
          }
          res.status(200).json({
            result: existing_user,
          });
    
    } catch (error) {
        console.error(error);
    }
      };
    export const registerUser = async (req,res)=> {
        try {
            const {username,email,password} = req.body;
            const new_user = await prisma.user.create({
                data: {    
                    username,
                    email,
                    password,
                },
            })
            return res.status(200).json({
                new_user
            })
            console.log('User registered:',  username)
        } catch (error) {
            console.error(error)
        }
    }
    export const ProfileChange = async  (req,res)=>{
        try{
        const title = req.body.name;
        const content = req.body.email;
        const id = req.body.id;
        const response = await prisma.user.findUnique({
          where:{
            id
          }
        })
        if(response){
          const update = await prisma.user.update({
            where:{
              id
            },
            data:{
              title:title,
            //   age:age,
              content:content,
            }
          })
          res.status(200).send({
            update
          })
        }else{
          res.status(200).json({
            success:false,
            msg:"article not found"
          })
        }
      }catch(err){
        console.log(err);
      }
}