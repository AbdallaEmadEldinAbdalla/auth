import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        console.log('Simple Auth-token API: Received request with idToken:', !!idToken);

        if (!idToken) {
            console.log('Simple Auth-token API: No idToken provided');
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        // For now, just create a simple token without Firebase Admin verification
        // This is for testing purposes only
        const authToken = Buffer.from(JSON.stringify({
            uid: 'test-user',
            email: 'test@example.com',
            name: 'Test User',
            exp: Date.now() + (60 * 60 * 24 * 5 * 1000) // 5 days
        })).toString('base64');

        console.log('Simple Auth-token API: Created simple auth token');

        return NextResponse.json({
            success: true,
            authToken,
            user: {
                uid: 'test-user',
                email: 'test@example.com',
                name: 'Test User'
            }
        });
    } catch (error) {
        console.error('Simple Auth-token API: Error creating auth token:', error);
        return NextResponse.json({ error: 'Failed to create auth token' }, { status: 500 });
    }
}
