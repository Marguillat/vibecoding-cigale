'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Reservation } from '@/lib/types';
import { fr } from 'date-fns/locale';
import { useMemo } from 'react';

interface CalendarViewProps {
    date: Date | undefined;
    onDateSelect: (date: Date | undefined) => void;
    reservations: Reservation[];
}

export function CalendarView({ date, onDateSelect, reservations }: CalendarViewProps) {
    // Calculer l'occupation pour chaque jour du mois affiché
    // Pour le MVP, on utilise toutes les réservations disponibles
    const occupancyByDate = useMemo(() => {
        const stats = new Map<string, number>();
        reservations.forEach((res) => {
            // Clé de date simple YYYY-MM-DD
            const dateKey = new Date(res.date).toDateString();
            const currentCount = stats.get(dateKey) || 0;
            stats.set(dateKey, currentCount + 1);
        });
        return stats;
    }, [reservations]);

    // Composant personnalisé pour le contenu d'une cellule jour
    // Note: Typage 'any' temporaire car l'export DayContentProps varie selon version RDP
    const CustomDayContent = (props: any) => {
        const { date: dayDate, ...dayProps } = props;
        const dateKey = dayDate.toDateString();
        const count = occupancyByDate.get(dateKey) || 0;

        // Déterminer la couleur de l'indicateur
        let indicatorColor = null;
        if (count > 0) {
            if (count < 5) indicatorColor = 'bg-emerald-500'; // Faible
            else if (count < 10) indicatorColor = 'bg-amber-500'; // Moyen
            else indicatorColor = 'bg-red-500'; // Elevé
        }

        return (
            <div className="relative flex flex-col items-center justify-center w-full h-full">
                <span>{dayDate.getDate()}</span>
                {indicatorColor && (
                    <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${indicatorColor}`} />
                )}
            </div>
        );
    };

    return (
        <div className="flex justify-center p-4">
            <Card className="w-full max-w-3xl">
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={onDateSelect}
                        locale={fr}
                        className="rounded-md border w-full"
                        components={{
                            DayContent: CustomDayContent
                        } as any}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
