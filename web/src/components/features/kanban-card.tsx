import { Reservation } from '@/lib/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

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
            <Card className={`cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg ${isDragging ? 'shadow-xl scale-105' : ''
                }`}>
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <p className="text-lg font-bold">{time}</p>
                        <p className="text-base truncate font-medium">{reservation.name}</p>
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
