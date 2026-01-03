import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { sku: string } }
) {
    const { sku } = params;

    // Simulate a 2-second delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({
        success: true,
        message: `Restock successful for SKU: ${sku}`,
        sku,
        newStockAdded: 50,
        timestamp: new Date().toISOString()
    });
}
