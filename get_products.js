const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  const products = await db.collection('products').find({}).toArray();
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}
main();
