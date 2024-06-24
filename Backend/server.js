import express from "express";
import { config } from "dotenv";
import { connectDb } from "./data/database.js";
import { createServer } from "http"; 
import { Server } from "socket.io"; 
import bodyParser from "body-parser";

config({
  path: "./Config.env",
});
connectDb();

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin:"http://localhost:5173",
  },
});


const port = process.env.PORT;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});