'use client';

import { Reservation } from '@/lib/types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { KanbanColumn } from './kanban-column';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateReservation } from '@/hooks/use-reservations';
import { toast } from 'sonner';
import { KanbanCard } from './kanban-card';

interface KanbanBoardProps {
    reservations: Reservation[];
}

export function KanbanBoard({ reservations }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const updateMutation = useUpdateReservation();

    // Configure sensors for touch and mouse
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px of movement required before drag starts
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, // 200ms hold before drag starts on touch
                tolerance: 5,
            },
        })
    );

    // Group reservations by status
    const grouped = {
        'en-attente': reservations.filter((r) => r.status === 'en-attente'),
        'arrivé': reservations.filter((r) => r.status === 'arrivé'),
        'libéré': reservations.filter((r) => r.status === 'libéré'),
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const reservationId = active.id as string;
        let newStatus = over.id as Reservation['status'];

        // If dropping over a card, find the status of that card's column
        if (!['en-attente', 'arrivé', 'libéré'].includes(newStatus)) {
            const overCard = reservations.find(r => r.id === over.id);
            if (overCard) {
                newStatus = overCard.status;
            } else {
                return; // Invalid drop target
            }
        }

        // Find the reservation being moved
        const reservation = reservations.find((r) => r.id === reservationId);
        if (!reservation || reservation.status === newStatus) return;

        // Optimistic update
        const previousData = queryClient.getQueryData<Reservation[]>(['reservations']);

        queryClient.setQueryData<Reservation[]>(['reservations'], (old) => {
            if (!old) return old;
            return old.map((r) =>
                r.id === reservationId ? { ...r, status: newStatus } : r
            );
        });

        // Update in background
        updateMutation.mutate(
            { id: reservationId, data: { status: newStatus } },
            {
                onError: (error) => {
                    // Rollback on error
                    queryClient.setQueryData(['reservations'], previousData);
                    toast.error('Erreur lors de la mise à jour du statut');
                    console.error(error);
                },
                onSuccess: () => {
                    toast.success('Statut mis à jour');
                },
            }
        );
    };

    const activeReservation = reservations.find((r) => r.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
                <KanbanColumn status="en-attente" reservations={grouped['en-attente']} />
                <KanbanColumn status="arrivé" reservations={grouped['arrivé']} />
                <KanbanColumn status="libéré" reservations={grouped['libéré']} />
            </div>

            <DragOverlay>
                {activeReservation ? (
                    <div className="rotate-3">
                        <KanbanCard reservation={activeReservation} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
