'use server';

import { getReservations, createReservation, updateReservation, deleteReservation, getWeekReservations } from '@/lib/airtable';
import { Reservation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function fetchReservations(date?: string) {
    return getReservations(date);
}

export async function fetchWeekReservations(weekStart: string) {
    return getWeekReservations(new Date(weekStart));
}

export async function addReservation(data: Omit<Reservation, 'id'>) {
    const result = await createReservation(data);
    revalidatePath('/dashboard');
    return result;
}

export async function modifyReservation(id: string, data: Partial<Reservation>) {
    const result = await updateReservation(id, data);
    revalidatePath('/dashboard');
    return result;
}

export async function removeReservation(id: string) {
    await deleteReservation(id);
    revalidatePath('/dashboard');
}
