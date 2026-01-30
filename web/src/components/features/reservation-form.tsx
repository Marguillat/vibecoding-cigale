'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Reservation } from '@/lib/types';
import { useCreateReservation, useUpdateReservation } from '@/hooks/use-reservations';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    phone: z.string().min(1, 'Téléphone requis'),
    guests: z.coerce.number().min(1, 'Minimum 1 personne'),
    date: z.string().min(1, 'Date et heure requises'),
    notes: z.string().optional(),
    status: z.enum(['en-attente', 'arrivé', 'libéré']).default('en-attente'),
});

type FormData = z.infer<typeof formSchema>;

interface ReservationFormProps {
    open: boolean;
    onClose: () => void;
    reservation?: Reservation;
}

export function ReservationForm({ open, onClose, reservation }: ReservationFormProps) {
    const createMutation = useCreateReservation();
    const updateMutation = useUpdateReservation();
    const isEdit = !!reservation;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: reservation || {
            name: '',
            phone: '',
            guests: 2,
            date: new Date().toISOString().slice(0, 16),
            notes: '',
            status: 'en-attente',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: reservation.id, data });
                toast.success('Réservation modifiée');
            } else {
                await createMutation.mutateAsync(data as Omit<Reservation, 'id'>);
                toast.success('Réservation créée');
            }
            onClose();
            form.reset();
        } catch {
            toast.error('Erreur lors de la sauvegarde');
        }
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEdit ? 'Modifier' : 'Nouvelle'} réservation</SheetTitle>
                    <SheetDescription>
                        {isEdit ? 'Modifiez les informations' : 'Créez une nouvelle réservation'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom du client" {...field} autoFocus />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="guests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de personnes</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date et heure</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (optionnel)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Allergies, demandes spéciales..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isEdit && (
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Statut</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="en-attente">En attente</SelectItem>
                                                <SelectItem value="arrivé">Arrivé</SelectItem>
                                                <SelectItem value="libéré">Libéré</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <Button type="submit" className="w-full h-12" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
