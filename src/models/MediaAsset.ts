import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMediaAsset extends Document {
  filename: string;
  originalName: string;
  url: string;
  key: string;
  type: 'image' | 'video' | 'model' | 'sound';
  mimeType: string;
  size: number;
  uploadedBy?: string;
  createdAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'model', 'sound'], required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: String },
  },
  { timestamps: true }
);

const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);

export default MediaAsset;
