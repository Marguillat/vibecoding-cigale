'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReservations, addReservation, modifyReservation, removeReservation } from '@/app/actions/reservations';
import { Reservation } from '@/lib/types';

export function useReservations(date?: string) {
    return useQuery({
        queryKey: ['reservations', date],
        queryFn: () => fetchReservations(date),
    });
}

export function useCreateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addReservation,
        onMutate: async (newReservation) => {
            await queryClient.cancelQueries({ queryKey: ['reservations'] });
            const previous = queryClient.getQueryData(['reservations']);

            queryClient.setQueryData(['reservations'], (old: Reservation[] = []) => [
                ...old,
                { ...newReservation, id: 'temp-' + Date.now() },
            ]);

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['reservations'], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
        },
    });
}

export function useUpdateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Reservation> }) => modifyReservation(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['reservations'] });
            const previous = queryClient.getQueryData(['reservations']);

            queryClient.setQueryData(['reservations'], (old: Reservation[] = []) =>
                old.map((r) => (r.id === id ? { ...r, ...data } : r))
            );

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['reservations'], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
        },
    });
}

export function useDeleteReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeReservation,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['reservations'] });
            const previous = queryClient.getQueryData(['reservations']);

            queryClient.setQueryData(['reservations'], (old: Reservation[] = []) => old.filter((r) => r.id !== id));

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['reservations'], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
        },
    });
}
