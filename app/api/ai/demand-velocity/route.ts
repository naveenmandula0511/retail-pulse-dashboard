import { NextResponse } from 'next/server';

// Simulation of Google Trends data for Retail Search Terms in the US (Last Hour)
const RETAIL_ENTITIES = [
    'Lululemon Leggings',
    'Stanely Cup Pink',
    'Air Jordan 1',
    'Samsung S24 Ultra',
    'Sony WH-1000XM5',
    'Dyson Airwrap',
    'Kindle Paperwhite',
    'Nintendo Switch OLED',
    'Patagonia Nano Puff',
    'Levi\'s 501'
];

const REGIONS = ['North', 'South', 'East', 'West'];

export async function GET() {
    // In a real scenario, we would fetch from Google Trends RSS or an API
    // https://trends.google.com/trends/trendingsearches/daily/rss?geo=US

    // For this mock, we'll pick a random retail entity and a random region
    const category = RETAIL_ENTITIES[Math.floor(Math.random() * RETAIL_ENTITIES.length)];
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];

    return NextResponse.json({
        region,
        category,
        timestamp: new Date().toISOString(),
        velocity: 'High'
    });
}
