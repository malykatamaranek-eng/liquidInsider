import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@liquidinsider.com' },
    update: {},
    create: {
      email: 'admin@liquidinsider.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isVerified: true,
    },
  });
  console.log('Created test user:', user.email);

  // Create categories
  const categories = [
    {
      name: 'Juice',
      slug: 'juice',
      description: 'Fresh and natural juices',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    },
    {
      name: 'Soda',
      slug: 'soda',
      description: 'Carbonated soft drinks',
      image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
    },
    {
      name: 'Water',
      slug: 'water',
      description: 'Pure and mineral water',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    },
    {
      name: 'Energy Drinks',
      slug: 'energy-drinks',
      description: 'Boost your energy',
      image: 'https://images.unsplash.com/photo-1622543925917-763c34ca82a2?w=400',
    },
    {
      name: 'Tea',
      slug: 'tea',
      description: 'Hot and iced tea varieties',
      image: 'https://images.unsplash.com/photo-1597318112308-fb8ec92b1e63?w=400',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('Created categories');

  // Get created categories
  const juice = await prisma.category.findUnique({ where: { slug: 'juice' } });
  const soda = await prisma.category.findUnique({ where: { slug: 'soda' } });
  const water = await prisma.category.findUnique({ where: { slug: 'water' } });
  const energy = await prisma.category.findUnique({ where: { slug: 'energy-drinks' } });
  const tea = await prisma.category.findUnique({ where: { slug: 'tea' } });

  // Create products
  const products = [
    {
      name: 'Orange Juice Fresh',
      slug: 'orange-juice-fresh',
      description: 'Freshly squeezed orange juice with no added sugar',
      price: 4.99,
      inventory: 100,
      categoryId: juice!.id,
      featured: true,
      images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800'],
    },
    {
      name: 'Apple Juice Organic',
      slug: 'apple-juice-organic',
      description: '100% organic apple juice',
      price: 5.49,
      inventory: 80,
      categoryId: juice!.id,
      featured: true,
      images: ['https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=800'],
    },
    {
      name: 'Cola Classic',
      slug: 'cola-classic',
      description: 'Classic cola flavor',
      price: 2.99,
      inventory: 200,
      categoryId: soda!.id,
      featured: false,
      images: ['https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800'],
    },
    {
      name: 'Lemon Soda',
      slug: 'lemon-soda',
      description: 'Refreshing lemon-flavored soda',
      price: 2.49,
      inventory: 150,
      categoryId: soda!.id,
      featured: false,
      images: ['https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800'],
    },
    {
      name: 'Spring Water 500ml',
      slug: 'spring-water-500ml',
      description: 'Pure spring water',
      price: 1.99,
      inventory: 500,
      categoryId: water!.id,
      featured: false,
      images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800'],
    },
    {
      name: 'Mineral Water 1L',
      slug: 'mineral-water-1l',
      description: 'Rich in minerals',
      price: 2.49,
      inventory: 300,
      categoryId: water!.id,
      featured: true,
      images: ['https://images.unsplash.com/photo-1559839914-17aae19d3d13?w=800'],
    },
    {
      name: 'Energy Boost',
      slug: 'energy-boost',
      description: 'High caffeine energy drink',
      price: 3.99,
      inventory: 120,
      categoryId: energy!.id,
      featured: true,
      images: ['https://images.unsplash.com/photo-1622543925917-763c34ca82a2?w=800'],
    },
    {
      name: 'Power Up Energy',
      slug: 'power-up-energy',
      description: 'Sugar-free energy drink',
      price: 3.49,
      inventory: 100,
      categoryId: energy!.id,
      featured: false,
      images: ['https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800'],
    },
    {
      name: 'Green Tea',
      slug: 'green-tea',
      description: 'Authentic Japanese green tea',
      price: 6.99,
      inventory: 60,
      categoryId: tea!.id,
      featured: true,
      images: ['https://images.unsplash.com/photo-1597318112308-fb8ec92b1e63?w=800'],
    },
    {
      name: 'Iced Lemon Tea',
      slug: 'iced-lemon-tea',
      description: 'Refreshing iced tea with lemon',
      price: 3.99,
      inventory: 90,
      categoryId: tea!.id,
      featured: false,
      images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800'],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log('Created products');

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
