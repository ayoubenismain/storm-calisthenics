const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const productsData = [
  {
    name: 'Low Parallettes (White Version)',
    slug: 'low-parallettes-white',
    shortDescription: 'Premium white low parallettes for calisthenics.',
    description: 'Enhance your handstands and push-ups with our premium white low parallettes. Handcrafted with high-quality materials to ensure stability and durability.',
    price: 99,
    discountPrice: 79,
    stock: 50,
    status: 'active',
    featured: true,
    localImages: ['IMG_8609.jpg', 'IMG_8622.JPG.jpeg', 'IMG_8616.JPG.jpeg']
  },
  {
    name: 'Low Parallettes (Black Version)',
    slug: 'low-parallettes-black',
    shortDescription: 'Premium black low parallettes for calisthenics.',
    description: 'Enhance your handstands and push-ups with our premium black low parallettes. Handcrafted with high-quality materials to ensure stability and durability.',
    price: 99,
    discountPrice: 79,
    stock: 50,
    status: 'active',
    featured: true,
    localImages: ['IMG_8613.JPG.jpeg', 'IMG_8618.jpg', 'IMG_8619.jpg']
  },
  {
    name: 'Medium Parallettes',
    slug: 'medium-parallettes',
    shortDescription: 'Medium height parallettes for advanced skills.',
    description: 'Perfect for L-sits, planches, and handstands. These medium parallettes offer the perfect balance of height and stability for intermediate and advanced calisthenics training.',
    price: 129,
    discountPrice: 99,
    stock: 40,
    status: 'active',
    featured: true,
    localImages: ['IMG_8701.jpg', 'IMG_8712.jpg', 'IMG_8727.jpg', 'IMG_8728.jpg', 'IMG_8731.jpg']
  }
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  
  const category = await db.collection('categories').findOne({ slug: 'paralettes' });
  if (!category) {
    console.error("Category not found!");
    process.exit(1);
  }
  
  // delete existing products
  await db.collection('products').deleteMany({});
  
  for (const prod of productsData) {
    console.log(`Uploading images for ${prod.name}...`);
    const imageUrls = [];
    for (const img of prod.localImages) {
       console.log(`- Uploading ${img}`);
       const result = await cloudinary.uploader.upload(`public/${img}`, {
         folder: 'storm-calisthenics'
       });
       imageUrls.push(result.secure_url);
    }
    
    console.log(`Saving ${prod.name}...`);
    await db.collection('products').insertOne({
      name: prod.name,
      slug: prod.slug,
      category: category._id,
      shortDescription: prod.shortDescription,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice,
      stock: prod.stock,
      status: prod.status,
      featured: prod.featured,
      images: imageUrls,
      videoUrl: "",
      model3dUrl: "",
      specs: [
        { label: "Material", value: "Premium Wood & Steel" },
        { label: "Grip", value: "Ergonomic 40mm Diameter" }
      ],
      trainingModes: ["Planche", "L-sit", "Handstand", "Push-up"],
      sceneStyle: "Dark",
      seoTitle: prod.name + " | Storm Barz",
      seoDescription: prod.shortDescription,
      variants: [],
      hotspots: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    });
  }
  
  console.log("Done!");
  process.exit(0);
}

main().catch(console.error);
