import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { authToken } = await request.json();

        if (!authToken) {
            return NextResponse.json({ valid: false, error: 'No auth token provided' }, { status: 400 });
        }

        // Decode and verify the auth token
        const decoded = JSON.parse(Buffer.from(authToken, 'base64').toString());

        // Check if token is expired
        if (decoded.exp && Date.now() > decoded.exp) {
            return NextResponse.json({ valid: false, error: 'Token expired' }, { status: 401 });
        }

        return NextResponse.json({
            valid: true,
            user: {
                uid: decoded.uid,
                email: decoded.email,
                name: decoded.name
            }
        });
    } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }
}
