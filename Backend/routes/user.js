import express from "express"
import { insertUser } from "../controller/user.js";
const UserRoute=express.Router();

UserRoute.post("/createUser",insertUser)

export default UserRoute