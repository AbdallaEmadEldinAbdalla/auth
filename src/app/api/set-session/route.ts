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

        // Create Firebase session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        // Set HttpOnly cookie for all subdomains
        const cookieOptions = {
            domain: '.arya.services',   // 🔑 allows sharing with app.arya.services + admin.arya.services
            httpOnly: true,
            secure: true,      // ✅ enable for production (https)
            path: '/',
            maxAge: expiresIn / 1000,
            sameSite: 'lax' as const,
        };

        console.log('Setting cookie with options:', cookieOptions);

        const response = NextResponse.json({ success: true, user: decoded });

        // Set the cookie in the response headers
        response.cookies.set('__session', sessionCookie, cookieOptions);

        return response;
    } catch (error) {
        console.error('Error setting session:', error);
        return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
    }
}
