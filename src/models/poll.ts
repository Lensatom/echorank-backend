import { model, Schema } from "mongoose";

const optionSchema = new Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
  imageURL: { type: String }
}, { _id: false });

const sectionSchema = new Schema({
  title: { type: String, required: true },
  options: { type: [optionSchema], required: true },
  is_required: { type: Boolean, required: true, default: false }
}, { _id: false });

const pollSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  title: { type: String, required: true },
  sub_title: { type: String },
  sections: { type: [sectionSchema], required: true },
  voteCount: { type: Number, required: true, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

const Poll = model('Poll', pollSchema);

export default Poll;