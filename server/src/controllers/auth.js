import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import abi from "../contract/NewsForumContract.json" assert {type : "json"}
// import { prisma } from "../primsa.js";
import { PrismaClient } from "@prisma/client";
// import {ethers} from "ethers"
// import { assert } from "ethers";
// import { types } from "hardhat/config";
export const prisma = new PrismaClient();
dotenv.config();

export const userLogin = async (req, res) => {
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
    const username = req.body.usernname;
    const email = req.body.email;
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
          username:username,
        //   age:age,
          email:email,
        }
      })
      res.status(200).send({
        success:true,
        update
      })
    }else{
      res.status(200).json({
        success:false,
        msg:"user not found"
      })
    }
  }catch(err){
    console.log(err);
  }
  }