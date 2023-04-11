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
        token,
      });
      
} catch (error) {
    console.error(error)
}
  };
export const registerUser = async (req,res)=> {
    try {
        const {username,email,password,private_key} = req.body;
        const new_user = await prisma.user.create({
            data: {    
                username,
                email,
                password,
                private_key
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