import { NextRequest, NextResponse } from 'next/server';

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { authToken } = await request.json();
        console.log('Verify-token API: Received authToken:', !!authToken);

        if (!authToken) {
            console.log('Verify-token API: No auth token provided');
            return NextResponse.json({ valid: false, error: 'No auth token provided' }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        // Decode and verify the auth token
        const decoded = JSON.parse(Buffer.from(authToken, 'base64').toString());
        console.log('Verify-token API: Decoded token:', decoded);

        // Check if token is expired
        if (decoded.exp && Date.now() > decoded.exp) {
            console.log('Verify-token API: Token expired');
            return NextResponse.json({ valid: false, error: 'Token expired' }, {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        console.log('Verify-token API: Token is valid');
        return NextResponse.json({
            valid: true,
            user: {
                uid: decoded.uid,
                email: decoded.email,
                name: decoded.name
            }
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error('Verify-token API: Token verification failed:', error);
        return NextResponse.json({ valid: false, error: 'Invalid token' }, {
            status: 401,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}
