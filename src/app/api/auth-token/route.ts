import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        console.log('Auth-token API: Received request with idToken:', !!idToken);

        if (!idToken) {
            console.log('Auth-token API: No idToken provided');
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        console.log('Auth-token API: Verifying idToken with Firebase Admin...');
        // Verify the token from client
        const decoded = await adminAuth.verifyIdToken(idToken);
        console.log('Auth-token API: Token verified successfully for user:', decoded.uid);

        // Create a simple auth token (in production, use JWT or similar)
        const authToken = Buffer.from(JSON.stringify({
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name,
            exp: Date.now() + (60 * 60 * 24 * 5 * 1000) // 5 days
        })).toString('base64');

        console.log('Auth-token API: Creating auth token and returning response');
        return NextResponse.json({
            success: true,
            authToken,
            user: decoded
        });
    } catch (error) {
        console.error('Auth-token API: Error creating auth token:', error);
        return NextResponse.json({ error: 'Failed to create auth token' }, { status: 500 });
    }
}
