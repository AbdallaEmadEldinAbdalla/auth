'use client';

import { useEffect } from 'react';

export default function LogoutAllPage() {
    useEffect(() => {
        const performGlobalLogout = async () => {
            try {
                // Get the current auth token
                const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
                
                if (authToken) {
                    // Call logout API to invalidate token server-side
                    await fetch('/api/logout-all', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ authToken }),
                    });
                }

                // Clear all tokens from localStorage and sessionStorage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_authenticated');
                localStorage.removeItem('auth_timestamp');
                sessionStorage.removeItem('auth_token');

                console.log('Global logout completed');

                // Redirect to login page
                window.location.href = '/login';
            } catch (error) {
                console.error('Error during global logout:', error);
                // Still redirect to login even if API call fails
                window.location.href = '/login';
            }
        };

        performGlobalLogout();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Logging out from all services...</p>
            </div>
        </div>
    );
}
