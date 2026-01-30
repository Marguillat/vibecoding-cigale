export interface Reservation {
    id: string;
    name: string;
    guests: number;
    date: string;
    phone: string;
    status: 'en-attente' | 'arrivé' | 'libéré';
    notes?: string;
}

export interface AirtableRecord {
    id: string;
    fields: {
        name: string;
        nb_chairs: number;
        date: string;
        phone_number: string;
        status?: string;
        options?: string;
    };
}
