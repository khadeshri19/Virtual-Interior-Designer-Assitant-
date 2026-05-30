// Mock furniture data for recommendations
export const furnitureData = [
    // Living Room - Modern
    {
        id: "1",
        name: "Nordic Modular Sofa",
        category: "Sofa",
        style: "Modern",
        price: 1299,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/sofa-modern-1.jpg",
        productUrl: "https://example.com/sofa-1",
        dimensions: "280cm x 95cm x 85cm",
        description: "Sleek modular sofa with clean lines and premium fabric upholstery."
    },
    {
        id: "2",
        name: "Marble Top Coffee Table",
        category: "Table",
        style: "Modern",
        price: 599,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/table-modern-1.jpg",
        productUrl: "https://example.com/table-1",
        dimensions: "120cm x 60cm x 45cm",
        description: "Elegant coffee table with genuine marble top and metal legs."
    },
    {
        id: "3",
        name: "Arc Floor Lamp",
        category: "Lighting",
        style: "Modern",
        price: 299,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/lamp-modern-1.jpg",
        productUrl: "https://example.com/lamp-1",
        dimensions: "180cm height",
        description: "Contemporary arc floor lamp with adjustable head."
    },
    {
        id: "4",
        name: "Accent Armchair Velvet",
        category: "Chair",
        style: "Modern",
        price: 449,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/chair-modern-1.jpg",
        productUrl: "https://example.com/chair-1",
        dimensions: "75cm x 80cm x 85cm",
        description: "Plush velvet armchair with gold-finished legs."
    },
    {
        id: "5",
        name: "Abstract Wool Rug",
        category: "Rug",
        style: "Modern",
        price: 349,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/rug-modern-1.jpg",
        productUrl: "https://example.com/rug-1",
        dimensions: "240cm x 180cm",
        description: "Hand-tufted wool rug with geometric pattern."
    },

    // Living Room - Minimalist
    {
        id: "6",
        name: "Minimal Platform Sofa",
        category: "Sofa",
        style: "Minimalist",
        price: 1599,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/sofa-minimal-1.jpg",
        productUrl: "https://example.com/sofa-2",
        dimensions: "260cm x 90cm x 75cm",
        description: "Low-profile platform sofa in neutral tones."
    },
    {
        id: "7",
        name: "Glass Top Side Table",
        category: "Table",
        style: "Minimalist",
        price: 199,
        budgetTier: "budget",
        imageUrl: "/images/furniture/table-minimal-1.jpg",
        productUrl: "https://example.com/table-2",
        dimensions: "50cm x 50cm x 55cm",
        description: "Minimal glass and steel side table."
    },

    // Living Room - Scandinavian
    {
        id: "8",
        name: "Oak Frame Sofa",
        category: "Sofa",
        style: "Scandinavian",
        price: 1199,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/sofa-scandi-1.jpg",
        productUrl: "https://example.com/sofa-3",
        dimensions: "200cm x 85cm x 80cm",
        description: "Solid oak frame with natural linen cushions."
    },
    {
        id: "9",
        name: "Birch Coffee Table",
        category: "Table",
        style: "Scandinavian",
        price: 399,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/table-scandi-1.jpg",
        productUrl: "https://example.com/table-3",
        dimensions: "100cm x 60cm x 40cm",
        description: "Natural birch wood with rounded edges."
    },

    // Living Room - Industrial
    {
        id: "10",
        name: "Leather Chesterfield Sofa",
        category: "Sofa",
        style: "Industrial",
        price: 1899,
        budgetTier: "luxury",
        imageUrl: "/images/furniture/sofa-industrial-1.jpg",
        productUrl: "https://example.com/sofa-4",
        dimensions: "220cm x 95cm x 80cm",
        description: "Distressed leather with tufted back."
    },
    {
        id: "11",
        name: "Pipe Frame Table",
        category: "Table",
        style: "Industrial",
        price: 449,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/table-industrial-1.jpg",
        productUrl: "https://example.com/table-4",
        dimensions: "120cm x 70cm x 45cm",
        description: "Reclaimed wood top with iron pipe frame."
    },

    // Living Room - Luxury
    {
        id: "12",
        name: "Italian Leather Sectional",
        category: "Sofa",
        style: "Luxury",
        price: 4999,
        budgetTier: "luxury",
        imageUrl: "/images/furniture/sofa-luxury-1.jpg",
        productUrl: "https://example.com/sofa-5",
        dimensions: "320cm x 260cm x 85cm",
        description: "Premium Italian leather with power recliners."
    },
    {
        id: "13",
        name: "Gold Accent Console",
        category: "Table",
        style: "Luxury",
        price: 1299,
        budgetTier: "luxury",
        imageUrl: "/images/furniture/table-luxury-1.jpg",
        productUrl: "https://example.com/table-5",
        dimensions: "140cm x 40cm x 80cm",
        description: "Brushed gold frame with black granite top."
    },

    // Living Room - Traditional
    {
        id: "14",
        name: "Classic Roll Arm Sofa",
        category: "Sofa",
        style: "Traditional",
        price: 1499,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/sofa-traditional-1.jpg",
        productUrl: "https://example.com/sofa-6",
        dimensions: "230cm x 100cm x 90cm",
        description: "Timeless design with rolled arms and turned legs."
    },
    {
        id: "15",
        name: "Cherry Wood End Table",
        category: "Table",
        style: "Traditional",
        price: 349,
        budgetTier: "mid-range",
        imageUrl: "/images/furniture/table-traditional-1.jpg",
        productUrl: "https://example.com/table-6",
        dimensions: "60cm x 60cm x 65cm",
        description: "Solid cherry wood with drawer storage."
    },

    // Budget Options
    {
        id: "16",
        name: "Basic Fabric Sofa",
        category: "Sofa",
        style: "Modern",
        price: 499,
        budgetTier: "budget",
        imageUrl: "/images/furniture/sofa-budget-1.jpg",
        productUrl: "https://example.com/sofa-7",
        dimensions: "200cm x 85cm x 80cm",
        description: "Affordable modern sofa with durable fabric."
    },
    {
        id: "17",
        name: "Simple Coffee Table",
        category: "Table",
        style: "Modern",
        price: 99,
        budgetTier: "budget",
        imageUrl: "/images/furniture/table-budget-1.jpg",
        productUrl: "https://example.com/table-7",
        dimensions: "100cm x 50cm x 40cm",
        description: "Clean design at an accessible price point."
    },
    {
        id: "18",
        name: "Desk Lamp LED",
        category: "Lighting",
        style: "Modern",
        price: 49,
        budgetTier: "budget",
        imageUrl: "/images/furniture/lamp-budget-1.jpg",
        productUrl: "https://example.com/lamp-2",
        dimensions: "45cm height",
        description: "Energy-efficient LED with adjustable brightness."
    },
];

// Get furniture recommendations based on style and budget
export function getFurnitureRecommendations(
    style: string,
    budgetTier?: string,
    limit: number = 5
): typeof furnitureData {
    let filtered = furnitureData.filter((item) =>
        item.style.toLowerCase() === style.toLowerCase()
    );

    if (budgetTier) {
        filtered = filtered.filter((item) => item.budgetTier === budgetTier);
    }

    // If not enough items for the style, fill with Modern items
    if (filtered.length < limit) {
        const modernItems = furnitureData.filter(
            (item) => item.style === "Modern" && !filtered.includes(item)
        );
        filtered = [...filtered, ...modernItems.slice(0, limit - filtered.length)];
    }

    return filtered.slice(0, limit);
}

// Color palettes by style
export const colorPalettes: Record<string, { name: string; colors: string[] }> = {
    Modern: {
        name: "Modern Sophistication",
        colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560", "#FFFFFF"],
    },
    Minimalist: {
        name: "Clean & Serene",
        colors: ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#212121"],
    },
    Scandinavian: {
        name: "Nordic Warmth",
        colors: ["#FFFFFF", "#F5F0E8", "#C9B99A", "#2F4F4F", "#87CEEB"],
    },
    Industrial: {
        name: "Urban Edge",
        colors: ["#2C3E50", "#7F8C8D", "#BDC3C7", "#E67E22", "#1ABC9C"],
    },
    Luxury: {
        name: "Opulent Gold",
        colors: ["#1C1C1C", "#B8860B", "#F5F5DC", "#8B4513", "#FFD700"],
    },
    Traditional: {
        name: "Classic Warmth",
        colors: ["#8B4513", "#DEB887", "#F5F5DC", "#2F4F4F", "#BC8F8F"],
    },
};

export function getColorPalette(style: string): string[] {
    return colorPalettes[style]?.colors || colorPalettes.Modern.colors;
}
