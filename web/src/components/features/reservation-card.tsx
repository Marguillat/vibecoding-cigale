'use client';

import { Reservation } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Check, CheckCheck, Clock, MoreVertical, Phone, Users, MessageSquareText, Pencil, Trash2 } from 'lucide-react';
import { useUpdateReservation, useDeleteReservation } from '@/hooks/use-reservations';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ReservationCardProps {
    reservation: Reservation;
    onEdit: (reservation: Reservation) => void;
}

export function ReservationCard({ reservation, onEdit }: ReservationCardProps) {
    const updateMutation = useUpdateReservation();
    const deleteMutation = useDeleteReservation();
    // ... existing code ...

    const time = new Date(reservation.date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleMarkArrived = () => {
        updateMutation.mutate({ id: reservation.id, data: { status: 'arrivé' } });
    };

    const handleMarkLibere = () => {
        updateMutation.mutate({ id: reservation.id, data: { status: 'libéré' } });
    };

    const handleCancel = () => {
        deleteMutation.mutate(reservation.id);
    };

    const statusConfig = {
        'en-attente': { label: 'En attente', variant: 'outline' as const, color: 'text-amber-500', icon: Clock },
        'arrivé': { label: 'Arrivé', variant: 'default' as const, color: 'text-emerald-500', icon: Check },
        'libéré': { label: 'Libéré', variant: 'secondary' as const, color: 'text-zinc-500', icon: CheckCheck },
    };

    const config = statusConfig[reservation.status];

    return (
        <Card className={reservation.status === 'arrivé' ? 'border-emerald-500/50 bg-emerald-500/5' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold">{time}</p>
                            {reservation.notes && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors touch-manipulation">
                                            <MessageSquareText className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                                            <span className="sr-only">Voir la note</span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-4 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" side="right" align="start">
                                        <p className="text-base text-amber-900 dark:text-amber-100">{reservation.notes}</p>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                        <Badge variant={config.variant} className="mt-1">
                            <config.icon className="mr-1 h-3 w-3" />
                            {config.label}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 text-muted-foreground hover:text-foreground"
                            onClick={() => onEdit(reservation)}
                        >
                            <Pencil className="h-6 w-6" />
                            <span className="sr-only">Modifier</span>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 w-12 text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="h-6 w-6" />
                                    <span className="sr-only">Annuler</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Voulez-vous vraiment annuler la réservation de {reservation.name} ?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Non</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCancel}>Oui, annuler</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-lg font-semibold">{reservation.name}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{reservation.guests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{reservation.phone}</span>
                    </div>
                </div>
                {reservation.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">{reservation.notes}</p>
                )}
            </CardContent>
            {reservation.status === 'en-attente' && (
                <CardFooter>
                    <Button onClick={handleMarkArrived} className="w-full h-12" size="lg">
                        <Check className="mr-2 h-5 w-5" />
                        Marquer comme arrivé
                    </Button>
                </CardFooter>
            )}
            {reservation.status === 'arrivé' && (
                <CardFooter>
                    <Button onClick={handleMarkLibere} variant="secondary" className="w-full h-12" size="lg">
                        <CheckCheck className="mr-2 h-5 w-5" />
                        Libérer la table
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
