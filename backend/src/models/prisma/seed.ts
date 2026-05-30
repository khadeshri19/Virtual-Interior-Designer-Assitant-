import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data...');

    // 1. Seed Style Presets
    const styles = [
        {
            name: 'Modern',
            description: 'Clean lines, bold accents, and contemporary aesthetics.',
            prompt: 'modern interior design, clean lines, minimalist furniture, bold accents, high contrast, cinematic lighting',
            imageUrl: '/styles/modern.jpg',
            config: { colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#FFFFFF'], keywords: ['sleek', 'bold', 'contemporary'] },
        },
        {
            name: 'Minimalist',
            description: 'Less is more. Functional, uncluttered, and serene.',
            prompt: 'minimalist interior design, wide open space, functional furniture, neutral tones, soft natural light',
            imageUrl: '/styles/minimalist.jpg',
            config: { colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121'], keywords: ['clean', 'simple', 'serene'] },
        },
        {
            name: 'Scandinavian',
            description: 'Nordic warmth with natural materials and light.',
            prompt: 'scandinavian interior design, hygge, light wood, natural textures, cozy atmosphere, bright and airy',
            imageUrl: '/styles/scandinavian.jpg',
            config: { colors: ['#FFFFFF', '#F5F0E8', '#C9B99A', '#2F4F4F', '#87CEEB'], keywords: ['cozy', 'natural', 'warm'] },
        },
        {
            name: 'Industrial',
            description: 'Raw materials, exposed elements, and urban character.',
            prompt: 'industrial loft interior design, exposed brick, metal beams, raw concrete, rustic wood, edison bulbs',
            imageUrl: '/styles/industrial.jpg',
            config: { colors: ['#2C3E50', '#7F8C8D', '#BDC3C7', '#E67E22', '#1ABC9C'], keywords: ['edgy', 'raw', 'urban'] },
        },
        {
            name: 'Luxury',
            description: 'Opulent finishes, rich textures, and premium comfort.',
            prompt: 'luxury interior design, marble floors, gold accents, velvet textures, chandeliers, sophisticated elegance',
            imageUrl: '/styles/luxury.jpg',
            config: { colors: ['#1C1C1C', '#B8860B', '#F5F5DC', '#8B4513', '#FFD700'], keywords: ['elegant', 'opulent', 'premium'] },
        },
        {
            name: 'Traditional',
            description: 'Timeless elegance with classic patterns and wood.',
            prompt: 'traditional interior design, mahogany wood, floral patterns, classic furniture, warm lighting, refined charm',
            imageUrl: '/styles/traditional.jpg',
            config: { colors: ['#8B4513', '#DEB887', '#F5F5DC', '#2F4F4F', '#BC8F8F'], keywords: ['timeless', 'classic', 'charming'] },
        },
    ];

    for (const style of styles) {
        await prisma.stylePreset.upsert({
            where: { name: style.name },
            update: style,
            create: style,
        });
    }

    // 2. Seed Furniture Items
    const furniture = [
        {
            name: 'Nordic Modular Sofa',
            category: 'Sofa',
            style: 'Modern',
            price: 1299,
            imageUrl: '/images/furniture/sofa-modern-1.jpg',
            shopUrl: 'https://example.com/sofa-1',
        },
        {
            name: 'Marble Top Coffee Table',
            category: 'Table',
            style: 'Modern',
            price: 599,
            imageUrl: '/images/furniture/table-modern-1.jpg',
            shopUrl: 'https://example.com/table-1',
        },
        {
            name: 'Leather Chesterfield Sofa',
            category: 'Sofa',
            style: 'Industrial',
            price: 1899,
            imageUrl: '/images/furniture/sofa-industrial-1.jpg',
            shopUrl: 'https://example.com/sofa-4',
        },
        {
            name: 'Oak Frame Scandi Sofa',
            category: 'Sofa',
            style: 'Scandinavian',
            price: 1199,
            imageUrl: '/images/furniture/sofa-scandi-1.jpg',
            shopUrl: 'https://example.com/sofa-3',
        },
    ];

    for (const item of furniture) {
        await prisma.furnitureItem.create({
            data: item,
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
