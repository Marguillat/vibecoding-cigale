'use client';

import React, { useState, useCallback } from 'react';
import { Reservation } from '@/lib/types';
import { TimelineBlock } from './timeline-block';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeekTimelineProps {
    reservations: Reservation[];
    weekStart: Date;
    onWeekChange: (newWeekStart: Date) => void;
    onReservationClick: (reservation: Reservation) => void;
    onEmptySlotClick: (date: Date, hour: number) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 11); // 11h → 22h
const CELL_HEIGHT = 64; // px par créneau horaire

function getWeekDays(weekStart: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });
}

function getMondayOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0=dimanche, 1=lundi...
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDayHeader(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function formatWeekRange(weekStart: Date): string {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const start = weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    const end = weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    return `Semaine du ${start} au ${end}`;
}

export function WeekTimeline({
    reservations,
    weekStart,
    onWeekChange,
    onReservationClick,
    onEmptySlotClick,
}: WeekTimelineProps) {
    const [visibleDayIndex, setVisibleDayIndex] = useState(0); // Pour mobile

    const weekDays = getWeekDays(weekStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevWeek = useCallback(() => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() - 7);
        onWeekChange(d);
    }, [weekStart, onWeekChange]);

    const nextWeek = useCallback(() => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + 7);
        onWeekChange(d);
    }, [weekStart, onWeekChange]);

    const goToToday = useCallback(() => {
        onWeekChange(getMondayOfWeek(new Date()));
    }, [onWeekChange]);

    // Grouper les réservations par jour+heure
    const getReservationsForSlot = (day: Date, hour: number): Reservation[] => {
        return reservations.filter((r) => {
            const rDate = new Date(r.date);
            return (
                rDate.getFullYear() === day.getFullYear() &&
                rDate.getMonth() === day.getMonth() &&
                rDate.getDate() === day.getDate() &&
                rDate.getHours() === hour
            );
        });
    };

    const isToday = (day: Date) => day.toDateString() === today.toDateString();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header Navigation */}
            <div className="flex items-center justify-between pb-4 flex-shrink-0 flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground">{formatWeekRange(weekStart)}</span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Aujourd'hui
                    </Button>
                    <Button variant="ghost" size="icon" onClick={prevWeek} aria-label="Semaine précédente">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextWeek} aria-label="Semaine suivante">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile: Navigation entre jours */}
            <div className="md:hidden flex items-center justify-between pb-3 flex-shrink-0">
                <Button
                    variant="ghost" size="icon"
                    onClick={() => setVisibleDayIndex(Math.max(0, visibleDayIndex - 1))}
                    disabled={visibleDayIndex === 0}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-semibold capitalize">
                    {formatDayHeader(weekDays[visibleDayIndex])}
                </span>
                <Button
                    variant="ghost" size="icon"
                    onClick={() => setVisibleDayIndex(Math.min(6, visibleDayIndex + 1))}
                    disabled={visibleDayIndex === 6}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Grille Timeline */}
            <div className="flex-1 overflow-auto">
                {/* Desktop: 8 colonnes (axe horaire + 7 jours) */}
                <div
                    className="hidden md:grid min-w-[700px]"
                    style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
                >
                    {/* Header ligne jours */}
                    <div className="sticky top-0 bg-background z-10 h-10" /> {/* Cellule vide axe horaire */}
                    {weekDays.map((day, i) => (
                        <div
                            key={i}
                            className={cn(
                                'sticky top-0 bg-background z-10 h-10 flex items-center justify-center text-xs font-medium border-b capitalize',
                                isToday(day) && 'text-primary font-bold'
                            )}
                        >
                            {formatDayHeader(day)}
                        </div>
                    ))}

                    {/* Lignes horaires */}
                    {HOURS.map((hour) => (
                        <React.Fragment key={hour}>
                            {/* Label heure */}
                            <div
                                key={`label-${hour}`}
                                className="flex items-start justify-end pr-2 pt-1 text-xs text-muted-foreground border-r border-b select-none"
                                style={{ height: CELL_HEIGHT }}
                            >
                                {`${String(hour).padStart(2, '0')}:00`}
                            </div>

                            {/* Cellules jours */}
                            {weekDays.map((day, dayIdx) => {
                                const slotReservations = getReservationsForSlot(day, hour);
                                return (
                                    <div
                                        key={`${hour}-${dayIdx}`}
                                        className={cn(
                                            'relative border-b border-r p-0.5 gap-0.5 flex flex-col',
                                            isToday(day) && 'bg-primary/5',
                                            !slotReservations.length && 'cursor-pointer hover:bg-accent/30 transition-colors'
                                        )}
                                        style={{ height: CELL_HEIGHT }}
                                        onClick={() => {
                                            if (!slotReservations.length) {
                                                onEmptySlotClick(day, hour);
                                            }
                                        }}
                                    >
                                        {slotReservations.map((r) => (
                                            <TimelineBlock
                                                key={r.id}
                                                reservation={r}
                                                onClick={onReservationClick}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* Mobile: 2 colonnes (axe horaire + 1 jour) */}
                <div
                    className="md:hidden grid"
                    style={{ gridTemplateColumns: '52px 1fr' }}
                >
                    {HOURS.map((hour) => {
                        const day = weekDays[visibleDayIndex];
                        const slotReservations = getReservationsForSlot(day, hour);
                        return (
                            <React.Fragment key={hour}>
                                <div
                                    key={`m-label-${hour}`}
                                    className="flex items-start justify-end pr-2 pt-1 text-xs text-muted-foreground border-r border-b select-none"
                                    style={{ height: CELL_HEIGHT }}
                                >
                                    {`${String(hour).padStart(2, '0')}:00`}
                                </div>
                                <div
                                    key={`m-cell-${hour}`}
                                    className={cn(
                                        'relative border-b p-0.5 gap-0.5 flex flex-col',
                                        isToday(day) && 'bg-primary/5',
                                        !slotReservations.length && 'cursor-pointer hover:bg-accent/30 transition-colors'
                                    )}
                                    style={{ height: CELL_HEIGHT }}
                                    onClick={() => {
                                        if (!slotReservations.length) {
                                            onEmptySlotClick(day, hour);
                                        }
                                    }}
                                >
                                    {slotReservations.map((r) => (
                                        <TimelineBlock
                                            key={r.id}
                                            reservation={r}
                                            onClick={onReservationClick}
                                        />
                                    ))}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
