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
 * Inventory health status for top 12 items (Electronics focused)
 */
export const inventoryData: InventoryItem[] = [
    { id: 'ELC-001', name: 'Wireless Earbuds X-200', stock: 15, status: 'In Stock' },
    { id: 'ELC-002', name: 'Smart Watch Series 9', stock: 0, status: 'Critical' },
    { id: 'ELC-003', name: 'AirPods Pro Gen 2', stock: 5, status: 'Low Stock' },
    { id: 'ELC-004', name: '4K OLED Gaming Monitor', stock: 12, status: 'In Stock' },
    { id: 'ELC-005', name: 'Mechanical RGB Keyboard', stock: 8, status: 'Low Stock' },
    { id: 'ELC-006', name: 'USB-C Charging Hub 7-in-1', stock: 89, status: 'In Stock' },
    { id: 'ELC-007', name: 'MagSafe Leather Wallet', stock: 34, status: 'In Stock' },
    { id: 'ELC-008', name: 'Noise Cancelling Headphones', stock: 22, status: 'In Stock' },
    { id: 'ELC-009', name: 'Bluetooth Soundbar 300W', stock: 3, status: 'Low Stock' },
    { id: 'ELC-010', name: 'DualSense Wireless Controller', stock: 45, status: 'In Stock' },
    { id: 'ELC-011', name: 'High-Speed HDMI 2.1 Cable', stock: 120, status: 'In Stock' },
    { id: 'ELC-012', name: 'Portable SSD 2TB', stock: 0, status: 'Critical' },
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
