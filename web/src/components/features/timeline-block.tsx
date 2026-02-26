'use client';

import { Reservation } from '@/lib/types';
import { MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineBlockProps {
    reservation: Reservation;
    onClick: (reservation: Reservation) => void;
}

const STATUS_STYLES = {
    'en-attente': 'border-amber-500',
    'arrivé': 'border-emerald-500',
    'libéré': 'border-zinc-400',
};

export function TimelineBlock({ reservation, onClick }: TimelineBlockProps) {
    const hour = new Date(reservation.date).getHours();
    const minutes = new Date(reservation.date).getMinutes();
    const timeLabel = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const borderClass = STATUS_STYLES[reservation.status] ?? 'border-zinc-400';

    return (
        <button
            className={cn(
                'w-full text-left rounded-md shadow-sm border-l-4 bg-white dark:bg-zinc-900 p-2 min-h-[60px] cursor-pointer hover:shadow-md transition-shadow',
                borderClass
            )}
            onClick={() => onClick(reservation)}
        >
            <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                    <span className="font-bold text-sm leading-tight block">{timeLabel}</span>
                    <span className="text-sm truncate block text-foreground/90">{reservation.name}</span>
                    <span className="text-xs text-muted-foreground">{reservation.guests} pers.</span>
                </div>
                {reservation.notes && (
                    <MessageSquareText className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                )}
            </div>
        </button>
    );
}
