import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShows, bookSeats } from '../api/shows';
import type { Show } from '../types';
import { Layout } from '../components/Layout';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [show, setShow] = useState<Show | null>(null);
    const [loading, setLoading] = useState(true);

    // Selection state
    const [selectedSeatCount, setSelectedSeatCount] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

    useEffect(() => {
        const fetchShow = async () => {
            try {
                const shows = await getShows();
                const found = shows.find(s => s.id === Number(id));
                if (found) setShow(found);
                else navigate('/'); // Redirect if not found
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchShow();
    }, [id, navigate]);

    const handleBook = async () => {
        if (!show || selectedSeatCount === 0) return;
        setProcessing(true);
        setBookingStatus('IDLE');

        try {
            const result = await bookSeats({ show_id: show.id, seat_count: selectedSeatCount });
            if (result.booking.status === 'CONFIRMED') {
                setBookingStatus('SUCCESS');
                // Refresh show data after short delay
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setBookingStatus('ERROR');
            }
        } catch (err) {
            setBookingStatus('ERROR');
        } finally {
            setProcessing(false);
        }
    };

    if (loading || !show) return (
        <Layout>
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        </Layout>
    );

    // Simulate seat grid
    // We don't have exact seat map, so we render 3 seat types:
    // 1. Booked (Indices 0 to total-available-1)
    // 2. Available (Indices total-available to total-1)
    // This is a naive visualization for the counter-based backend.

    const bookedCount = show.total_seats - (show.available_seats || 0);
    const totalSeats = show.total_seats;

    // We can't really "select" specific seats because the backend only takes count.
    // Requirement says: "Select a show/trip/slot and see available seats visually (grid/seat layout)."
    // AND "Implement seat selection in the booking page with direct DOM updates for highlighting selected seats"
    // To bridge this: we allow user to click available seats, we count how many they clicked, and send that count.
    // We visualize them as 1..N.

    // Let's assume indices 0..bookedCount-1 are TAKEN.
    // Indices bookedCount..totalSeats-1 are OPEN.

    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

    const toggleSeat = (index: number) => {
        if (index < bookedCount) return; // Taken
        const newSet = new Set(selectedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedIndices(newSet);
        setSelectedSeatCount(newSet.size);
    };

    return (
        <Layout>
            <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shows
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                {/* Left: Info */}
                <div className="lg:w-1/3 bg-gray-900 p-8 text-white flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{show.name}</h1>
                        <p className="text-blue-300 text-lg mb-6">{new Date(show.start_time).toLocaleString()}</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <span className="text-gray-400">Total Seats</span>
                                <span className="font-mono text-xl">{show.total_seats}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                <span className="text-gray-400">Available</span>
                                <span className="font-mono text-xl text-green-400">{show.available_seats}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300">Selected</span>
                            <span className="text-2xl font-bold">{selectedSeatCount}</span>
                        </div>

                        <button
                            onClick={handleBook}
                            disabled={selectedSeatCount === 0 || processing || bookingStatus === 'SUCCESS'}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center",
                                bookingStatus === 'SUCCESS' ? "bg-green-500 text-white" :
                                    bookingStatus === 'ERROR' ? "bg-red-500 text-white" :
                                        selectedSeatCount > 0
                                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 transform hover:scale-[1.02]"
                                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            {processing ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : bookingStatus === 'SUCCESS' ? (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" /> Booked!
                                </>
                            ) : bookingStatus === 'ERROR' ? (
                                <>
                                    <AlertCircle className="w-5 h-5 mr-2" /> Failed
                                </>
                            ) : (
                                `Confirm ${selectedSeatCount} Seats`
                            )}
                        </button>
                        {bookingStatus === 'ERROR' && (
                            <p className="text-red-400 text-sm mt-2 text-center">Booking failed. Seats might be taken.</p>
                        )}
                    </div>
                </div>

                {/* Right: Seat Grid */}
                <div className="flex-1 p-8 bg-gray-50 overflow-y-auto max-h-[80vh]">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Select Seats</h2>

                    <div className="flex justify-center gap-6 mb-8 text-sm">
                        <div className="flex items-center"><div className="w-4 h-4 bg-gray-300 rounded mr-2" /> Booked</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2" /> Available</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-blue-600 rounded mr-2" /> Your Selection</div>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-w-2xl mx-auto">
                        {Array.from({ length: totalSeats }).map((_, idx) => {
                            const isBooked = idx < bookedCount;
                            const isSelected = selectedIndices.has(idx);

                            return (
                                <button
                                    key={idx}
                                    disabled={isBooked}
                                    onClick={() => toggleSeat(idx)}
                                    className={clsx(
                                        "aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 relative",
                                        isBooked
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : isSelected
                                                ? "bg-blue-600 text-white shadow-md scale-110 ring-2 ring-blue-200 z-10"
                                                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:shadow-sm"
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-12 w-full h-2 bg-gray-200 rounded-full flex justify-center relative">
                        <span className="absolute -top-6 text-gray-400 text-sm uppercase tracking-widest">Screen</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
