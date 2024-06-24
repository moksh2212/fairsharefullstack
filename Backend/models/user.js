import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  FullName: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", UserSchema);
export default UserSchema;