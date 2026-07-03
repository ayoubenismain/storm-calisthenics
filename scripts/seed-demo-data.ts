import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/storm-calisthenics';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  // ── USER MODEL ──────────────────────────────────────────────────
  const UserSchema = new mongoose.Schema({
    name: String, email: { type: String, unique: true },
    passwordHash: String, role: { type: String, default: 'admin' },
  }, { timestamps: true });
  const User = mongoose.models.User || mongoose.model('User', UserSchema);

  // ── CATEGORY MODEL ───────────────────────────────────────────────
  const CategorySchema = new mongoose.Schema({
    name: String, slug: { type: String, unique: true },
    description: String, imageUrl: String, status: { type: String, default: 'active' },
  }, { timestamps: true });
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

  // ── PRODUCT MODEL ────────────────────────────────────────────────
  const ProductSchema = new mongoose.Schema({
    name: String, slug: { type: String, unique: true },
    category: mongoose.Schema.Types.ObjectId,
    shortDescription: String, description: String,
    price: Number, discountPrice: Number,
    stock: Number, status: { type: String, default: 'active' },
    featured: Boolean, images: [String], videoUrl: String, model3dUrl: String,
    variants: Array, specs: Array, hotspots: Array,
    trainingModes: [String], sceneStyle: String,
    seoTitle: String, seoDescription: String,
  }, { timestamps: true });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

  // ── STORM SETTINGS MODEL ─────────────────────────────────────────
  const SettingsSchema = new mongoose.Schema({
    storeName: String, contactEmail: String, contactPhone: String,
    contactAddress: String, socialInstagram: String,
    socialFacebook: String, socialTiktok: String, socialYoutube: String,
    deliveryFee: Number, currency: String,
    heroTitle: String, heroSubtitle: String, heroCtaPrimary: String,
    lightningEnabled: Boolean, footerTagline: String,
    seoTitle: String, seoDescription: String,
  }, { timestamps: true });
  const Settings = mongoose.models.StormSettings || mongoose.model('StormSettings', SettingsSchema);

  // ── SEED ADMIN ───────────────────────────────────────────────────
  const existing = await User.findOne({ email: 'admin@stormbarz.com' });
  if (!existing) {
    await User.create({
      name: 'Storm Admin',
      email: 'admin@stormbarz.com',
      passwordHash: await bcrypt.hash('stormadmin123', 10),
      role: 'admin',
    });
    console.log('✓ Admin user created: admin@stormbarz.com / stormadmin123');
  } else {
    console.log('✓ Admin already exists');
  }

  // ── SEED SETTINGS ────────────────────────────────────────────────
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      storeName: 'Storm Barz',
      contactEmail: 'contact@stormbarz.com',
      contactPhone: '+216 XX XXX XXX',
      contactAddress: 'Tunisia',
      socialInstagram: 'https://www.instagram.com/storm.barz/',
      deliveryFee: 8,
      currency: 'TND',
      heroTitle: 'BECOME THE STORM.',
      heroSubtitle: 'Premium parallettes built for control, power, and clean movement.',
      heroCtaPrimary: 'Shop Parallettes',
      lightningEnabled: true,
      footerTagline: 'Built for athletes. Tested in the storm.',
      seoTitle: 'Storm Barz | Premium Calisthenics Equipment',
      seoDescription: 'Become the Storm. Premium parallettes built for control, power, and clean movement.',
    });
    console.log('✓ Storm Settings created');
  }

  // ── SEED CATEGORY ────────────────────────────────────────────────
  let cat = await Category.findOne({ slug: 'parallettes' });
  if (!cat) {
    cat = await Category.create({
      name: 'Parallettes',
      slug: 'parallettes',
      description: 'Premium calisthenics parallettes for all skill levels.',
      status: 'active',
    });
    console.log('✓ Category created: Parallettes');
  }

  // ── SEED PRODUCTS (from public folder images) ────────────────────
  const products = [
    {
      name: 'Storm Premium Parallettes – Classic',
      slug: 'storm-premium-parallettes-classic',
      category: cat._id,
      shortDescription: 'Premium calisthenics parallettes built for control, stability, and explosive training.',
      description: 'Storm Premium Parallettes are designed for athletes who demand control, durability, and confidence in every movement. Built for planche work, L-sits, handstand push-ups, push-ups, dips, and advanced calisthenics progressions.',
      price: 179,
      discountPrice: 149,
      stock: 25,
      status: 'active',
      featured: true,
      images: ['/product.jpeg', '/IMG_8617.JPG.jpeg'],
      model3dUrl: '',
      specs: [
        { label: 'Material', value: 'Premium Steel' },
        { label: 'Grip', value: 'Anti-slip ergonomic grip' },
        { label: 'Base', value: 'Stable anti-slip feet' },
        { label: 'Use', value: 'Indoor & Outdoor' },
        { label: 'Weight Capacity', value: '200kg' },
      ],
      trainingModes: ['Planche', 'L-sit', 'Handstand', 'Push-up', 'Dips'],
      sceneStyle: 'Dark',
      seoTitle: 'Storm Premium Parallettes – Buy Online | Storm Barz',
      seoDescription: 'Premium steel parallettes for advanced calisthenics training. Built for control and power.',
    },
    {
      name: 'Storm Pro Parallettes – Low Bar',
      slug: 'storm-pro-parallettes-low-bar',
      category: cat._id,
      shortDescription: 'Low bar parallettes for floor-level calisthenics skills.',
      description: 'Perfect for athletes who train closer to the ground. Optimized for L-sits, handstands, and dip progressions. Storm Pro Low Bar Parallettes offer exceptional stability with a sleek, minimal design.',
      price: 129,
      discountPrice: null,
      stock: 18,
      status: 'active',
      featured: false,
      images: ['/IMG_8618.jpg', '/IMG_8619.jpg'],
      model3dUrl: '',
      specs: [
        { label: 'Material', value: 'Steel & Rubber' },
        { label: 'Height', value: 'Low Profile – 12cm' },
        { label: 'Grip', value: 'High-density foam grip' },
        { label: 'Weight Capacity', value: '180kg' },
      ],
      trainingModes: ['L-sit', 'Handstand', 'Push-up', 'Mobility'],
      sceneStyle: 'Metal',
      seoTitle: 'Storm Pro Low Bar Parallettes | Storm Barz',
      seoDescription: 'Low profile calisthenics parallettes. Premium steel, ergonomic grip, maximum stability.',
    },
  ];

  for (const p of products) {
    const exists = await Product.findOne({ slug: p.slug });
    if (!exists) {
      await Product.create(p);
      console.log(`✓ Product created: ${p.name}`);
    } else {
      console.log(`  Skipped (exists): ${p.name}`);
    }
  }

  console.log('\n⚡ Storm Barz database seeded successfully!');
  console.log('   Login: admin@stormbarz.com / stormadmin123\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
