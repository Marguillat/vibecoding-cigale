'use client';

import { useState, useEffect, useCallback } from 'react';
import { useReservations, useWeekReservations } from '@/hooks/use-reservations';
import { ReservationCard } from '@/components/features/reservation-card';
import { ReservationForm } from '@/components/features/reservation-form';
import { KanbanBoard } from '@/components/features/kanban-board';
import { CalendarView } from '@/components/features/calendar-view';
import { WeekTimeline } from '@/components/features/week-timeline';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, LogOut, List, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import { Reservation } from '@/lib/types';
import { logout } from '../actions/auth';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

/** Retourne le lundi de la semaine contenant `date` */
function getMondayOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

const PLANNING_MODE_KEY = 'planning-mode';

export default function DashboardPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();
    const [prefillDate, setPrefillDate] = useState<string | undefined>();

    // --- État Vue Liste / Kanban ---
    const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());

    // --- État Vue Planning (sous-mode: mois | semaine) ---
    const [planningMode, setPlanningMode] = useState<'month' | 'week'>('month');
    const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()));

    const router = useRouter();

    // Restaurer le mode planning depuis localStorage
    useEffect(() => {
        const saved = localStorage.getItem(PLANNING_MODE_KEY);
        if (saved === 'month' || saved === 'week') {
            setPlanningMode(saved);
        }
    }, []);

    const handlePlanningModeChange = (mode: 'month' | 'week') => {
        setPlanningMode(mode);
        localStorage.setItem(PLANNING_MODE_KEY, mode);
    };

    // Data
    const { data: reservations, isLoading } = useReservations();
    const { data: weekReservations, isLoading: isWeekLoading } = useWeekReservations(weekStart);

    const handleEdit = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setPrefillDate(undefined);
        setFormOpen(true);
    };

    const handleClose = () => {
        setFormOpen(false);
        setEditingReservation(undefined);
        setPrefillDate(undefined);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // Clic sur créneau vide de la timeline
    const handleEmptySlotClick = useCallback((date: Date, hour: number) => {
        const d = new Date(date);
        d.setHours(hour, 0, 0, 0);
        setPrefillDate(d.toISOString().slice(0, 16));
        setEditingReservation(undefined);
        setFormOpen(true);
    }, []);

    // Clic date sur le calendrier mensuel → filtre liste et bascule sur "list"
    const handleCalendarDateSelect = (date: Date | undefined) => {
        setCurrentDate(date);
    };

    const displayedDate = currentDate
        ? currentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Date non sélectionnée';

    const filteredReservations = reservations?.filter((r) => {
        if (!currentDate) return true;
        return new Date(r.date).toDateString() === currentDate.toDateString();
    }) ?? [];

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" />

            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div>
                        <h1 className="text-xl font-bold">La Cigale</h1>
                        <p className="text-sm text-muted-foreground capitalize">{displayedDate}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => { setEditingReservation(undefined); setPrefillDate(undefined); setFormOpen(true); }} size="lg" className="h-12">
                            <Plus className="mr-2 h-5 w-5" />
                            Nouvelle réservation
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" size="icon" className="h-12 w-12" aria-label="Déconnexion">
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container px-4 py-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full" />
                        ))}
                    </div>
                ) : (
                    <Tabs defaultValue="list" className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
                            <TabsTrigger value="list" className="flex items-center gap-2">
                                <List className="h-4 w-4" />
                                Liste
                            </TabsTrigger>
                            <TabsTrigger value="kanban" className="flex items-center gap-2">
                                <LayoutGrid className="h-4 w-4" />
                                Kanban
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Planning
                            </TabsTrigger>
                        </TabsList>

                        {/* === Vue Liste === */}
                        <TabsContent value="list" className="mt-0">
                            {filteredReservations.length > 0 ? (
                                <ScrollArea className="h-[calc(100vh-14rem)]">
                                    <div className="space-y-4 pb-4">
                                        {filteredReservations.map((r) => (
                                            <ReservationCard key={r.id} reservation={r} onEdit={handleEdit} />
                                        ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center">
                                    <p className="text-lg text-muted-foreground">Aucune réservation pour le {displayedDate}</p>
                                    <Button onClick={() => setFormOpen(true)} className="mt-4" size="lg">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Créer une réservation
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        {/* === Vue Kanban === */}
                        <TabsContent value="kanban" className="mt-0 h-[calc(100vh-14rem)]">
                            <div className="h-full overflow-hidden">
                                <KanbanBoard reservations={filteredReservations} />
                            </div>
                        </TabsContent>

                        {/* === Vue Planning (Mois | Semaine) === */}
                        <TabsContent value="calendar" className="mt-0">
                            {/* Sub-toggle Mois / Semaine */}
                            <div className="flex justify-center mb-4">
                                <div className="inline-flex rounded-md border bg-muted p-1">
                                    <button
                                        className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${planningMode === 'month'
                                                ? 'bg-background shadow text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        onClick={() => handlePlanningModeChange('month')}
                                    >
                                        Mois
                                    </button>
                                    <button
                                        className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${planningMode === 'week'
                                                ? 'bg-background shadow text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        onClick={() => handlePlanningModeChange('week')}
                                    >
                                        Semaine
                                    </button>
                                </div>
                            </div>

                            {planningMode === 'month' ? (
                                <CalendarView
                                    date={currentDate}
                                    onDateSelect={handleCalendarDateSelect}
                                    reservations={reservations ?? []}
                                />
                            ) : (
                                <div className="h-[calc(100vh-16rem)]">
                                    {isWeekLoading ? (
                                        <div className="space-y-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))}
                                        </div>
                                    ) : (
                                        <WeekTimeline
                                            reservations={weekReservations ?? []}
                                            weekStart={weekStart}
                                            onWeekChange={setWeekStart}
                                            onReservationClick={handleEdit}
                                            onEmptySlotClick={handleEmptySlotClick}
                                        />
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </main>

            <ReservationForm
                open={formOpen}
                onOpenChange={setFormOpen}
                initialData={editingReservation}
                prefillDate={prefillDate}
                onClose={handleClose}
            />
        </div>
    );
}
