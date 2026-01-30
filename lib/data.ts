export type Product = {
    id: string;
    name: string;
    category: 'Women' | 'Men' | 'Kids' | 'Accessories';
    price: number;
    image: string;
    description: string;
    baseColor: string; // The dominant color of the product in the image, for selective recoloring
};

export const products: Product[] = [
    // Women
    {
        id: 'w1',
        name: 'Silk Evening Gown',
        category: 'Women',
        price: 2499,
        image: '/images/w1.png', // Mannequin
        description: 'Elegant purple evening gown with a timeless silhouette.',
        baseColor: '#702a70', // Vibrant Purple (Matches Silk Saturation)
    },
    {
        id: 'w2',
        name: 'Summer Breeze Dress',
        category: 'Women',
        price: 999,
        image: '/images/w2.png', // Mannequin
        description: 'Light and airy white summer dress, perfect for beach days.',
        baseColor: '#ffffff', // White
    },
    {
        id: 'w3',
        name: 'Chic Structured Blazer',
        category: 'Women',
        price: 1899,
        image: '/images/w3.png', // Mannequin
        description: 'Power meets style. A structured grey blazer jacket.',
        baseColor: '#5e5e5e', // Grey
    },

    // Men
    {
        id: 'm1',
        name: 'Classic Navy Suit',
        category: 'Men',
        price: 3499,
        image: '/images/m1.png', // Mannequin
        description: 'Tailored to perfection Navy Blue suit.',
        baseColor: '#2c3e50', // Navy
    },
    {
        id: 'm2',
        name: 'Casual Denim Jacket',
        category: 'Men',
        price: 1499,
        image: '/images/m2.png', // Mannequin
        description: 'Classic vintage-wash denim jacket.',
        baseColor: '#4d6c8b', // Deep Denim Blue
    },
    {
        id: 'm3',
        name: 'Crisp White Shirt',
        category: 'Men',
        price: 899,
        image: '/images/m3.png', // Mannequin
        description: 'Essential white button-down shirt.',
        baseColor: '#ffffff', // White
    },

    // Kids
    {
        id: 'k1',
        name: 'Pink Party Dress',
        category: 'Kids',
        price: 899,
        image: '/images/k1.png', // Mannequin
        description: 'A sparkling pink delight for little ones.',
        baseColor: '#e0a0a0', // Pink
    },
    {
        id: 'k2',
        name: 'Yellow Raincoat',
        category: 'Kids',
        price: 799,
        image: '/images/k2.png', // Mannequin
        description: 'Bright and cheerful yellow raincoat.',
        baseColor: '#ffd700', // Yellow
    },
    {
        id: 'k3',
        name: 'Patterned Sweater',
        category: 'Kids',
        price: 699,
        image: '/images/k3.png', // Mannequin
        description: 'Cozy winter knit for chilly days.',
        baseColor: '#8c5a40', // Brown/Rust
    },

    // Accessories
    {
        id: 'a1',
        name: 'Leather Tote Bag',
        category: 'Accessories',
        price: 1999,
        image: '/images/a1.png', // Mannequin
        description: 'Handcrafted premium leather bag.',
        baseColor: '#906040', // Brown leather
    },
    {
        id: 'a2',
        name: 'Silk Scarf',
        category: 'Accessories',
        price: 499,
        image: '/images/a2.png', // Mannequin
        description: 'Elegant patterned silk scarf.',
        baseColor: '#cc8899', // Pinkish Pattern
    },
    {
        id: 'a3',
        name: 'Gold Statement Necklace',
        category: 'Accessories',
        price: 999,
        image: '/images/a3.png', // Mannequin
        description: 'Bold and beautiful gold-plated necklace.',
        baseColor: '#ffd700', // Gold
    },
];
