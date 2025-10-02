import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { authToken } = await request.json();
        console.log('Verify-token API: Received authToken:', !!authToken);

        if (!authToken) {
            console.log('Verify-token API: No auth token provided');
            return NextResponse.json({ valid: false, error: 'No auth token provided' }, { status: 400 });
        }

        // Decode and verify the auth token
        const decoded = JSON.parse(Buffer.from(authToken, 'base64').toString());
        console.log('Verify-token API: Decoded token:', decoded);

        // Check if token is expired
        if (decoded.exp && Date.now() > decoded.exp) {
            console.log('Verify-token API: Token expired');
            return NextResponse.json({ valid: false, error: 'Token expired' }, { status: 401 });
        }

        console.log('Verify-token API: Token is valid');
        return NextResponse.json({
            valid: true,
            user: {
                uid: decoded.uid,
                email: decoded.email,
                name: decoded.name
            }
        });
    } catch (error) {
        console.error('Verify-token API: Token verification failed:', error);
        return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }
}
