import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        // Verify the token from client
        const decoded = await adminAuth.verifyIdToken(idToken);

        // Create a simple auth token (in production, use JWT or similar)
        const authToken = Buffer.from(JSON.stringify({
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name,
            exp: Date.now() + (60 * 60 * 24 * 5 * 1000) // 5 days
        })).toString('base64');

        return NextResponse.json({
            success: true,
            authToken,
            user: decoded
        });
    } catch (error) {
        console.error('Error creating auth token:', error);
        return NextResponse.json({ error: 'Failed to create auth token' }, { status: 500 });
    }
}
