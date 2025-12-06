import { model, Schema } from "mongoose";

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  otp: { type: String },
  otp_expiry: { type: Date },
  is_verified: { type: Boolean, default: false }
})

export const User = model('User', userSchema);