import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        const origin = request.headers.get('origin') || '*';

        // Get the session cookie from the request
        const sessionCookie = request.cookies.get('__session')?.value;

        console.log('Verify-session: Checking for session cookie:', !!sessionCookie);
        console.log('Verify-session: Request origin:', origin);

        if (!sessionCookie) {
            return NextResponse.json(
                { valid: false, error: 'No session cookie' },
                {
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': origin,
                        'Access-Control-Allow-Credentials': 'true',
                        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                }
            );
        }

        // Verify the session cookie
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        console.log('Verify-session: Session valid for user:', decodedClaims.uid);

        return NextResponse.json(
            {
                valid: true,
                user: {
                    uid: decodedClaims.uid,
                    email: decodedClaims.email,
                    name: decodedClaims.name,
                },
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    } catch (error) {
        console.error('Verify-session: Session verification failed:', error);
        const origin = request.headers.get('origin') || '*';
        return NextResponse.json(
            { valid: false, error: 'Invalid session' },
            {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin') || '*';
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
