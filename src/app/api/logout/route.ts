import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get('origin') || '*';

        // Clear the session cookie
        const response = NextResponse.json(
            { success: true },
            {
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );

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
        const origin = request.headers.get('origin') || '*';
        return NextResponse.json(
            { error: 'Failed to logout' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
