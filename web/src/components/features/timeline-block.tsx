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
            <div className="flex items-center justify-between gap-1 h-full">
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <span className="font-bold text-sm leading-tight block">{timeLabel}</span>
                    <span className="text-sm truncate block text-foreground/90 capitalize">{reservation.name}</span>
                </div>
                <div className="flex flex-col items-end justify-center gap-1 shrink-0 ml-1">
                    <span className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}
                    </span>
                    {reservation.notes && (
                        <MessageSquareText className="h-3.5 w-3.5 text-amber-500" />
                    )}
                </div>
            </div>
        </button>
    );
}
