import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Clear the session cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('__session', '', {
            domain: '.arya.services',
            httpOnly: true,
            secure: true, // production HTTPS
            path: '/',
            maxAge: 0,     // expire now
        });

        return response;
    } catch (error) {
        console.error('Error logging out:', error);
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}
