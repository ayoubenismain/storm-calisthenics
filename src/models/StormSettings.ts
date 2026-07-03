import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStormSettings extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  featuredProductId?: string;
  stormIntensity: 'calm' | 'heavy' | 'thunder';
  lightningEnabled: boolean;
  rainEnabled: boolean;
  smokeEnabled: boolean;
  defaultSoundEnabled: boolean;
  homepageMood: 'dark-metal' | 'blue-thunder' | 'smoke-arena' | 'minimal-luxury';
  deliveryFee: number;
  currency: string;
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTiktok: string;
  socialYoutube: string;
  seoTitle: string;
  seoDescription: string;
  footerTagline: string;
  updatedAt: Date;
}

const StormSettingsSchema = new Schema<IStormSettings>(
  {
    heroTitle: { type: String, default: 'BECOME THE STORM.' },
    heroSubtitle: { type: String, default: 'Premium parallettes built for control, power, and clean movement.' },
    heroCtaPrimary: { type: String, default: 'Shop Parallettes' },
    heroCtaSecondary: { type: String, default: 'Explore Model' },
    featuredProductId: { type: String },
    stormIntensity: { type: String, enum: ['calm', 'heavy', 'thunder'], default: 'heavy' },
    lightningEnabled: { type: Boolean, default: true },
    rainEnabled: { type: Boolean, default: false },
    smokeEnabled: { type: Boolean, default: false },
    defaultSoundEnabled: { type: Boolean, default: false },
    homepageMood: {
      type: String,
      enum: ['dark-metal', 'blue-thunder', 'smoke-arena', 'minimal-luxury'],
      default: 'blue-thunder',
    },
    deliveryFee: { type: Number, default: 8 },
    currency: { type: String, default: 'TND' },
    storeName: { type: String, default: 'Storm Barz' },
    contactEmail: { type: String, default: 'contact@stormbarz.com' },
    contactPhone: { type: String, default: '+216 XX XXX XXX' },
    contactAddress: { type: String, default: 'Tunisia' },
    socialInstagram: { type: String, default: 'https://www.instagram.com/storm.barz/' },
    socialFacebook: { type: String, default: '' },
    socialTiktok: { type: String, default: '' },
    socialYoutube: { type: String, default: '' },
    seoTitle: { type: String, default: 'Storm Barz | Premium Calisthenics Equipment' },
    seoDescription: { type: String, default: 'Become the Storm. Premium parallettes built for control, power, and clean movement.' },
    footerTagline: { type: String, default: 'Built for athletes. Tested in the storm.' },
  },
  { timestamps: true }
);

const StormSettings: Model<IStormSettings> =
  mongoose.models.StormSettings || mongoose.model<IStormSettings>('StormSettings', StormSettingsSchema);

export default StormSettings;
