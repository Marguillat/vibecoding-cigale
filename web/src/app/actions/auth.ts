'use server';

import { cookies } from 'next/headers';
import { createToken, verifyToken } from '@/lib/auth';

export async function login(pin: string) {
    if (pin !== process.env.APP_ACCESS_CODE) {
        return { success: false, error: 'Code incorrect' };
    }

    const token = await createToken();
    const cookieStore = await cookies();

    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
    });

    return { success: true };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return false;

    return verifyToken(token);
}
