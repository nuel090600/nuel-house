const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');
require('dotenv').config();

const sampleProperties = [
  {
    title: "Real House Luxury Villa",
    description: "A stunning luxury villa with modern amenities and beautiful architecture located in the heart of Victoria Island.",
    location: "Victoria Island, Lagos",
    bedrooms: 6,
    bathrooms: 3,
    price: 3340000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388673/houseimage1_u0b5mm.png",
    featured: true,
    type: "villa",
    area: "5000 sq ft",
    status: "available",
    for: "Sale"
  },
  {
    title: "Exquisite Haven Villa",
    description: "Beautiful villa perfect for families, featuring spacious rooms and a large garden in a peaceful neighborhood.",
    location: "Festac, Lagos",
    bedrooms: 5,
    bathrooms: 3,
    price: 4000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388674/houseimage2_biyoxb.png",
    featured: true,
    type: "villa",
    area: "4500 sq ft",
    status: "available",
    for: "Rent"
  },
  {
    title: "Luxe Palatial Villa",
    description: "Magnificent palace-style villa with premium finishes and exceptional architectural design.",
    location: "Gbagada, Lagos",
    bedrooms: 7,
    bathrooms: 3,
    price: 5350000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388673/houseimage3_tdw8hm.png",
    featured: true,
    type: "villa",
    area: "6000 sq ft",
    status: "available",
    for: "Sale"
  },
  {
    title: "Harmony Luxury Villa",
    description: "Elegant villa offering perfect harmony between modern luxury and comfortable living spaces.",
    location: "Mushin, Lagos",
    bedrooms: 4,
    bathrooms: 3,
    price: 4000000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388674/houseimage4_rnhqr6.png",
    featured: true,
    type: "villa",
    area: "3800 sq ft",
    status: "available",
    for: "Sale"
  },
  {
    title: "Real House Luxury Villa",
    description: "Premium rental villa with excellent facilities and convenient access to major business districts.",
    location: "Victoria Island, Lagos",
    bedrooms: 6,
    bathrooms: 4,
    price: 350000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388673/houseimage5_anqrfl.png",
    featured: true,
    type: "villa",
    area: "5200 sq ft",
    status: "available",
    for: "Rent"
  },
  {
    title: "Real House Luxury Villa",
    description: "Contemporary villa design with smart home features and luxurious amenities in Lekki.",
    location: "Lekki-Ajah, Lagos",
    bedrooms: 5,
    bathrooms: 3,
    price: 4200000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388674/houseimage6_uv6em9.png",
    featured: true,
    type: "villa",
    area: "4800 sq ft",
    status: "available",
    for: "Sale"
  },
  {
    title: "Infinite Bliss Villa",
    description: "Peaceful retreat villa offering tranquility and modern comfort in Enugu's serene environment.",
    location: "Ishagu, Enugu",
    bedrooms: 5,
    bathrooms: 3,
    price: 2350000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388673/houseimage7_r3umij.png",
    featured: true,
    type: "villa",
    area: "4200 sq ft",
    status: "available",
    for: "Sale"
  },
  {
    title: "Real House Luxury Villa",
    description: "Spacious rental villa perfect for large families or corporate use in Owerri.",
    location: "Work Layout, Owerri",
    bedrooms: 8,
    bathrooms: 6,
    price: 3350000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388673/houseimage8_en55nk.png",
    featured: true,
    type: "villa",
    area: "7000 sq ft",
    status: "available",
    for: "Rent"
  },
  {
    title: "Real House Luxury Villa",
    description: "Modern luxury villa in Ikeja with premium finishes and excellent location advantages.",
    location: "Ikeja, Lagos",
    bedrooms: 6,
    bathrooms: 6,
    price: 600000000,
    image: "https://res.cloudinary.com/ds0a0s3k3/image/upload/v1748388673/houseimage9_tmjjmt.png",
    featured: true,
    type: "villa",
    area: "5500 sq ft",
    status: "available",
    for: "Sale"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany();
    console.log('Cleared existing properties');

    // Get a user to set as owner
    const user = await User.findOne();
    
    if (!user) {
      console.log('No user found. Please create a user first.');
      return;
    }

    // Add owner to each property
    const propertiesWithOwner = sampleProperties.map(property => ({
      ...property,
      owner: user._id
    }));

    await Property.insertMany(propertiesWithOwner);
    console.log('Sample properties added to database');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();