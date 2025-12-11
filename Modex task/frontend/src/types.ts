export interface Show {
    id: number;
    name: string;
    start_time: string;
    total_seats: number;
    booked_seats?: number; // Optional because GET /shows might return available_seats instead
    available_seats?: number;
    created_at?: string;
}

export interface Booking {
    id: number;
    show_id: number;
    seat_count: number;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    created_at: string;
}

export interface CreateShowPayload {
    name: string;
    start_time: string;
    total_seats: number;
}

export interface BookSeatPayload {
    show_id: number;
    seat_count: number;
}
