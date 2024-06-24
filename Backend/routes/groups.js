import express from "express"
import { createGroup } from "../controller/groups.js";
import { addMember } from "../controller/groups.js";
import { getgroups } from "../controller/groups.js";
import { getgroupBalance } from "../controller/groups.js";
import { deletegroup } from "../controller/groups.js";
import { getRecentActivities } from "../controller/groups.js";

const GroupsRoute=express.Router();
 
GroupsRoute.post("/createGroup",createGroup)
GroupsRoute.post("/addMember",addMember)


GroupsRoute.get("/getgroups/:username",getgroups)
GroupsRoute.post("/getgroupsBalance",getgroupBalance)
GroupsRoute.delete("/delete/:GroupId",deletegroup)
GroupsRoute.get("/RecentActivities/:grpid",getRecentActivities)

  
export default GroupsRoute;