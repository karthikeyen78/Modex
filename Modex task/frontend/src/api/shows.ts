import client from './client';
import type { Show, CreateShowPayload, Booking, BookSeatPayload } from '../types';

export const getShows = async (): Promise<Show[]> => {
    const response = await client.get<Show[]>('/shows'); // Matches GET / in user routes? Wait, index.js says app.use("/", userRoutes) and userRoutes has router.get("/shows", ...)
    // So it is /shows.
    return response.data;
};

export const createShow = async (payload: CreateShowPayload): Promise<Show> => {
    const response = await client.post<{ show: Show }>('/admin/show', payload);
    return response.data.show;
};

export const bookSeats = async (payload: BookSeatPayload): Promise<{ message: string; booking: Booking }> => {
    const response = await client.post<{ message: string; booking: Booking }>('/book', payload);
    return response.data;
};
