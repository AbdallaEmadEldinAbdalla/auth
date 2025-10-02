import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { authToken } = await request.json();
        console.log('Logout-all API: Received logout request for token:', !!authToken);

        // In a real implementation, you would:
        // 1. Add the token to a blacklist/revocation list
        // 2. Store it in a database or Redis cache
        // 3. Check this list during token verification
        
        // For now, we'll just log the logout
        if (authToken) {
            try {
                const decoded = JSON.parse(Buffer.from(authToken, 'base64').toString());
                console.log('Logout-all API: User logged out:', decoded.uid);
            } catch (error) {
                console.log('Logout-all API: Could not decode token');
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Logged out successfully'
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        console.error('Logout-all API: Error during logout:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to logout' 
        }, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

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
