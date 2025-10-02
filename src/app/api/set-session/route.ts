import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

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
        // Note: .local domain might not work in all browsers for localhost development
        // For localhost, we'll try without domain first, then .localhost as fallback
        const cookieOptions = {
            domain: undefined,   // Let browser handle domain for localhost
            httpOnly: true,
            secure: false,      // ❌ disable for local dev, enable in prod (https)
            path: '/',
            maxAge: expiresIn / 1000,
            sameSite: 'lax' as const,
        };

        console.log('Setting cookie with options:', cookieOptions);
        cookies().set('__session', sessionCookie, cookieOptions);

        const response = NextResponse.json({ success: true, user: decoded });

        // Also set the cookie in the response headers for debugging
        response.cookies.set('__session', sessionCookie, cookieOptions);

        return response;
    } catch (error) {
        console.error('Error setting session:', error);
        return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
    }
}
