import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check environment variables
        const envCheck = {
            FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
            FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
            FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
        };

        console.log('Test Firebase API: Environment check:', envCheck);

        // Try to import and initialize Firebase Admin
        let adminAuth;
        try {
            const { getAuth } = await import('firebase-admin/auth');
            adminAuth = getAuth();
            console.log('Test Firebase API: Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('Test Firebase API: Firebase Admin SDK initialization failed:', error);
            return NextResponse.json({
                success: false,
                error: 'Firebase Admin SDK initialization failed',
                envCheck,
                details: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Firebase Admin SDK is working',
            envCheck
        });
    } catch (error) {
        console.error('Test Firebase API: Unexpected error:', error);
        return NextResponse.json({
            success: false,
            error: 'Unexpected error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
