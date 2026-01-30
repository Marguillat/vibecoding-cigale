'use client';

import { useState } from 'react';
import { useReservations } from '@/hooks/use-reservations';
import { ReservationCard } from '@/components/features/reservation-card';
import { ReservationForm } from '@/components/features/reservation-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, LogOut } from 'lucide-react';
import { Reservation } from '@/lib/types';
import { logout } from '../actions/auth';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

export default function DashboardPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();
    const { data: reservations, isLoading } = useReservations();
    const router = useRouter();

    const handleEdit = (reservation: Reservation) => {
        setEditingReservation(reservation);
        setFormOpen(true);
    };

    const handleClose = () => {
        setFormOpen(false);
        setEditingReservation(undefined);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-background">
            <Toaster position="top-center" />

            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div>
                        <h1 className="text-xl font-bold">La Cigale</h1>
                        <p className="text-sm text-muted-foreground capitalize">{today}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setFormOpen(true)} size="lg" className="h-12">
                            <Plus className="mr-2 h-5 w-5" />
                            Nouvelle
                        </Button>
                        <Button onClick={handleLogout} variant="ghost" size="icon" className="h-12 w-12">
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
                ) : reservations && reservations.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-10rem)]">
                        <div className="space-y-4 pb-4">
                            {reservations.map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} onEdit={handleEdit} />
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center">
                        <p className="text-lg text-muted-foreground">Aucune réservation aujourd'hui</p>
                        <Button onClick={() => setFormOpen(true)} className="mt-4" size="lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Créer une réservation
                        </Button>
                    </div>
                )}
            </main>

            <ReservationForm open={formOpen} onClose={handleClose} reservation={editingReservation} />
        </div>
    );
}
