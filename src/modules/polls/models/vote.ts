import { model, Schema } from "mongoose";

const sectionSchema = new Schema({
  sectionId: { type: Schema.Types.ObjectId, ref: 'Poll.sections._id', required: true },
  ranking: { type: [String], required: true },
  groups: { type: Object || undefined }
}, { _id: false });

const voteSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  sections: { type: [sectionSchema], required: true },
  poll_id: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export const Vote = model('Vote', voteSchema);