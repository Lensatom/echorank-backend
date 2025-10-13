import { model, Schema } from "mongoose";

const optionSchema = new Schema({
  optionId: { type: Schema.Types.ObjectId, required: true, auto: true },
  title: { type: String, required: true },
  imageURL: { type: String }
}, { _id: false });

const sectionSchema = new Schema({
  sectionId: { type: Schema.Types.ObjectId, required: true, auto: true },
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
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  result_id: { type: Schema.Types.ObjectId, ref: 'Result', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

const Poll = model('Poll', pollSchema);

export default Poll;