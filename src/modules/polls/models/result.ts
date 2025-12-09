import { model, Schema } from "mongoose";

const resultSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
  voteCountCalculated: { type: Number, default: 0 },
  sections: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export const Result = model('Result', resultSchema);