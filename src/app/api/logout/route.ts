import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the session cookie
        cookies().set('__session', '', {
            domain: '.local',
            httpOnly: true,
            secure: false, // local only
            path: '/',
            maxAge: 0,     // expire now
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error logging out:', error);
        return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
    }
}
