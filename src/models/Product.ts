import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  status: 'draft' | 'active' | 'hidden';
  featured: boolean;
  images: string[];
  videoUrl?: string;
  model3dUrl?: string;
  variants: {
    name: string;
    color: string;
    size?: string;
    material?: string;
    price: number;
    stock: number;
    sku: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['draft', 'active', 'hidden'], default: 'draft' },
    featured: { type: Boolean, default: false },
    images: [{ type: String }],
    videoUrl: { type: String },
    model3dUrl: { type: String },
    variants: [
      {
        name: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String },
        material: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        sku: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
