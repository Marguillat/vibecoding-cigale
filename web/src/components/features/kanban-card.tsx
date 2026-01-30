import { Reservation } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquareText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface KanbanCardProps {
    reservation: Reservation;
}

export function KanbanCard({ reservation }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: reservation.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Format time from ISO date
    const time = new Date(reservation.date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`touch-none ${isDragging ? 'opacity-50' : ''}`}
        >
            <Card className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg relative group ${isDragging ? 'shadow-xl scale-105' : ''
                }`}>
                <CardContent className="p-4">
                    {reservation.notes && (
                        <div className="absolute top-2 right-2 z-10" onPointerDown={(e) => e.stopPropagation()}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors touch-manipulation">
                                        <MessageSquareText className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                        <span className="sr-only">Voir la note</span>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-3 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" side="left">
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{reservation.notes}</p>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                    <div className="space-y-2">
                        <p className="text-lg font-bold">{time}</p>
                        <p className="text-base truncate font-medium pr-8">{reservation.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{reservation.guests} {reservation.guests > 1 ? 'personnes' : 'personne'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
