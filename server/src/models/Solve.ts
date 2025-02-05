import mongoose, { Document } from 'mongoose';

export interface ISolve extends Document {
  user_id: String;
  time: Number;
  event: String
}

const solveSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true,
  },
  event: {
    type: String,
    required: true
  },
  dnf: {
    type: Boolean,
  },
  plusTwo: {
    type: Boolean,
  },
  scramble: {
    type: String
  }
}, {
  timestamps: true,
});

export const Solve = mongoose.model<ISolve>('Solve', solveSchema);