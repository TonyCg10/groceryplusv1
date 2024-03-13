import mongoose, { Document } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  img?: string;
  stripeCustomerId?: string
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    img: {
      type: mongoose.Schema.Types.String,
    },
    stripeCustomerId: { 
      type: mongoose.Schema.Types.String,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<UserDocument>('User', userSchema);
