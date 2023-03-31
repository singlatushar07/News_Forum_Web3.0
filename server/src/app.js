import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import bodyParser from "body-parser";
import cors from "cors";
import {authRoutes,articleRoutes } from "./routes/index.js";
dotenv.config();
const app = express();
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
const port = process.env.port || 5000;

app.use("/auth",authRoutes);
app.use("/article",articleRoutes);
app.listen(port, async () => {
    console.log(`Server listening at http://localhost:${port}`);
  });