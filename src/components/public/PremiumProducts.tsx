"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  description: string;
}

const SimpleCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.slug}`} className="block w-full h-full group">
      <div className="relative w-full h-full rounded-2xl bg-white border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col z-10">
        
        {/* Simple Image Container */}
        <div className="relative w-full aspect-square mb-6 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
           <Image
              src={product.images?.[0] || "/product.jpeg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain filter mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
           />
           {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-md animate-bounce">
                SALE
              </div>
           )}
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 font-heading transition-colors group-hover:text-gray-600">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
            {product.description}
          </p>
          
          <div className="flex items-end justify-between mt-auto">
            <div>
              {product.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 line-through mb-1">{product.price} TND</span>
                  <span className="text-2xl font-bold text-gray-900 leading-none">{product.discountPrice} TND</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900 leading-none">{product.price} TND</span>
              )}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white">
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <svg className="absolute w-full h-auto text-gray-100/50 top-0 left-0" viewBox="0 0 1440 320" fill="currentColor">
      <path d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
    </svg>
    <svg className="absolute w-full h-auto text-gray-100/50 bottom-0 left-0 rotate-180" viewBox="0 0 1440 320" fill="currentColor">
      <path d="M0,128L60,133.3C120,139,240,149,360,133.3C480,117,600,75,720,74.7C840,75,960,117,1080,138.7C1200,160,1320,160,1380,160L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
    </svg>
  </div>
);

export default function PremiumProducts({ products }: { products: Product[] }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const displayProducts = products.length > 0 ? products : Array(3).fill({
    _id: "skeleton",
    name: "Loading...",
    slug: "#",
    price: 0,
    images: [],
    description: "Loading equipment..."
  });

  return (
    <section id="products" className="relative bg-white text-black py-24 px-6">
      <WaveBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4"
            >
              Our Equipment
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg"
            >
              Premium calisthenics equipment designed for athletes who demand clean movement and perfect control.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/products" className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-wide hover:text-gray-500 transition-colors">
              View All 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayProducts.map((product, i) => (
            <motion.div key={product._id + i} variants={itemVariants} className="h-full">
              {product._id === "skeleton" ? (
                 <div className="w-full h-full aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
              ) : (
                <SimpleCard product={product} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
