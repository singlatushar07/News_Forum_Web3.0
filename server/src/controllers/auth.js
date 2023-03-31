import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { prisma } from "../primsa.js";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
dotenv.config();


export const userLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existing_user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!existing_user)
        return res.status(404).json({ message: "User doesn't exist" });
  
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existing_user.password
      );
  
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: existing_user.id, username: existing_user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
  
      delete existing_user["password"];
      delete existing_user["updated_at"];
  
      res.status(200).json({
        result: existing_user,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

export const userSignup = async (req, res) => {
    const {  username, email, password, confirm_password } = req.body;
  
    try {
      let existing_user = await prisma.user.findMany({
        where: {
          OR: [
            {
              email: email,
            },
            {
              username: username,
            },
          ],
        },
      });
  
      if (existing_user.length)
        return res
          .status(400)
          .json({ message: "User with same email or username already exists" });
  
      if (password !== confirm_password)
        return res.status(400).json({ message: "Passwords don't match" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      let data = {
        username,
        email,
        password: hashedPassword,
        created_at: new Date(),
      };
  
      const user = await prisma.user.create({
        data,
      });
  
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );
  
      delete user["password"];
      delete user["updated_at"];
  
      res.status(200).json({ result: user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };