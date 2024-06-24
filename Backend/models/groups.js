import mongoose from "mongoose";
import UserSchema from "./user.js";

const GroupSchema = mongoose.Schema({
  GroupId: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  GroupName: {
    type: String,
    required: true,
  },
  Color: {
    type: String,
    required: true,
  },
  Settledup:{
    type: Map,
    of: Number,
  },
  RecentActivities:[String],
  Members:[UserSchema]
});

export const Groups =mongoose.model("Groups",GroupSchema)
