import Airtable from 'airtable';
import { Reservation, AirtableRecord } from './types';

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

const table = base(process.env.AIRTABLE_TABLE_NAME || 'Reservations');

export function mapAirtableToReservation(record: AirtableRecord): Reservation {
    return {
        id: record.id,
        name: record.fields.name,
        guests: record.fields.nb_chairs,
        date: record.fields.date,
        phone: record.fields.phone_number,
        status: (record.fields.status as Reservation['status']) || 'en-attente',
        notes: record.fields.options,
    };
}

export async function getReservations(date?: string): Promise<Reservation[]> {
    const formula = date
        ? `IS_SAME({date}, '${date}', 'day')`
        : `IS_SAME({date}, TODAY(), 'day')`;

    const records = await table
        .select({
            filterByFormula: formula,
            sort: [{ field: 'date', direction: 'asc' }],
        })
        .all();

    return records.map((r) => mapAirtableToReservation(r as unknown as AirtableRecord));
}

export async function createReservation(data: Omit<Reservation, 'id'>): Promise<Reservation> {
    const record = await table.create({
        name: data.name,
        nb_chairs: data.guests,
        date: data.date,
        phone_number: data.phone,
        status: data.status || 'en-attente',
        options: data.notes,
    });

    return mapAirtableToReservation(record as unknown as AirtableRecord);
}

export async function updateReservation(id: string, data: Partial<Reservation>): Promise<Reservation> {
    const fields: Record<string, unknown> = {};

    if (data.name) fields.name = data.name;
    if (data.guests) fields.nb_chairs = data.guests;
    if (data.date) fields.date = data.date;
    if (data.phone) fields.phone_number = data.phone;
    if (data.status) fields.status = data.status;
    if (data.notes !== undefined) fields.options = data.notes;

    const record = await table.update(id, fields as any);
    return mapAirtableToReservation(record as unknown as AirtableRecord);
}

export async function deleteReservation(id: string): Promise<void> {
    await table.destroy(id);
}
