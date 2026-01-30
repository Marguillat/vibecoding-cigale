import { Reservation } from '@/lib/types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './kanban-card';
import { Clock, Check, CheckCheck } from 'lucide-react';

interface KanbanColumnProps {
    status: Reservation['status'];
    reservations: Reservation[];
}

const statusConfig = {
    'en-attente': {
        label: 'En attente',
        icon: Clock,
        color: 'text-amber-500',
        bgLight: 'bg-amber-50/50',
        bgDark: 'dark:bg-amber-950/20',
    },
    'arrivé': {
        label: 'Arrivé',
        icon: Check,
        color: 'text-emerald-500',
        bgLight: 'bg-emerald-50/50',
        bgDark: 'dark:bg-emerald-950/20',
    },
    'libéré': {
        label: 'Libéré',
        icon: CheckCheck,
        color: 'text-zinc-500',
        bgLight: 'bg-zinc-50/50',
        bgDark: 'dark:bg-zinc-900/50',
    },
};

export function KanbanColumn({ status, reservations }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`p-4 border-b ${config.bgLight} ${config.bgDark}`}>
                <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    <h3 className="font-semibold text-lg">{config.label}</h3>
                    <span className="ml-auto text-sm text-muted-foreground">
                        ({reservations.length})
                    </span>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                ref={setNodeRef}
                className={`flex-1 p-4 overflow-y-auto transition-all ${config.bgLight
                    } ${config.bgDark} ${isOver ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                    }`}
            >
                <SortableContext
                    items={reservations.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {reservations.length === 0 ? (
                            <p className="text-center text-muted-foreground text-sm py-8">
                                Aucune réservation
                            </p>
                        ) : (
                            reservations.map((reservation) => (
                                <KanbanCard key={reservation.id} reservation={reservation} />
                            ))
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
