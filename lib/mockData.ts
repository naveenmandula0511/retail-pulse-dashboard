/**
 * RetailPulse Mock Data Layer
 * Generated for high-fidelity dashboard prototyping.
 */

export interface SaleRecord {
    date: string;
    revenue: number;
    profit: number;
    visitors: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Critical';
}

export interface RegionData {
    region: string;
    lat: number;
    lng: number;
    revenue: number;
}

/**
 * 30 days of daily sales records
 * Revenue fluctuates between $12,000 and $18,000
 */
export const salesData: SaleRecord[] = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));

    // Deterministic random-like values for realistic prototyping
    const seed = i * 1337;
    const revenue = 12000 + (Math.sin(seed) * 3000 + 3000);
    const profit = revenue * (0.2 + (Math.cos(seed) * 0.05));
    const visitors = 2000 + Math.floor(Math.abs(Math.tan(seed)) * 500) % 1500;

    return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(revenue),
        profit: Math.floor(profit),
        visitors: Math.floor(visitors),
    };
});

/**
 * Inventory health status for top 8 items
 */
export const inventoryData: InventoryItem[] = [
    { id: 'SKU-001', name: 'Wireless Earbuds', stock: 0, status: 'Critical' },
    { id: 'SKU-002', name: 'Smart Watch Pro', stock: 12, status: 'Low Stock' },
    { id: 'SKU-003', name: 'Noise Cancelling Headphones', stock: 45, status: 'In Stock' },
    { id: 'SKU-004', name: 'Bluetooth Speaker', stock: 8, status: 'Low Stock' },
    { id: 'SKU-005', name: 'USB-C Charging Hub', stock: 89, status: 'In Stock' },
    { id: 'SKU-006', name: 'MagSafe Power Bank', stock: 34, status: 'In Stock' },
    { id: 'SKU-007', name: 'Leather Phone Case', stock: 5, status: 'Low Stock' },
    { id: 'SKU-008', name: 'Mechanical Keyboard', stock: 22, status: 'In Stock' },
];

/**
 * Regional revenue distribution with geospatial coordinates
 */
export const regionData: RegionData[] = [
    { region: 'North', lat: 45.4215, lng: -75.6972, revenue: 450000 }, // Ottawa
    { region: 'South', lat: 25.7617, lng: -80.1918, revenue: 320000 }, // Miami
    { region: 'East', lat: 40.7128, lng: -74.0060, revenue: 890000 },  // New York
    { region: 'West', lat: 34.0522, lng: -118.2437, revenue: 670000 }, // Los Angeles
];
