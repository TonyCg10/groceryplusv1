import mongoose, { Document } from 'mongoose';
import { UserDocument } from './users';
import { ProductDocument } from './products';

export interface OrderType {
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  issuedDate: Date;
  hours: string;
  status: 'ongoing' | 'completed' | 'cancelled' | 'pending';
}


export interface OrderDocument extends Document {
  userId: mongoose.Types.ObjectId | UserDocument;
  products: Array<{
    productId: mongoose.Types.ObjectId | ProductDocument;
    quantity?: number;
  }>;
  issuedDate: Date;
  hours: string;
  status: 'ongoing' | 'completed' | 'cancelled' | 'pending';
}

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: mongoose.Schema.Types.Number,
          default: 1,
        },
      },
    ],
    issuedDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    hours: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.pre<OrderDocument>('find', function (next) {
  this.populate('products.productId' as keyof OrderDocument);
  next();
});

export default mongoose.model<OrderDocument>('Order', orderSchema);