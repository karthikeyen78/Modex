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
                if (found) {
                    setShow(found);
                } else {
                    console.error('Show ID not found in list:', id);
                    // Don't navigate away, let the UI show empty state or error
                }
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
            console.log('Sending booking request...', { show_id: show.id, seat_count: selectedSeatCount });
            const result = await bookSeats({ show_id: show.id, seat_count: selectedSeatCount });
            console.log('Booking Result:', result);

            if (result.booking.status === 'CONFIRMED') {
                setBookingStatus('SUCCESS');
                // Refresh show data after short delay
                setTimeout(() => window.location.reload(), 1500);
            } else {
                console.error('Booking Failed Status:', result.booking.status);
                setBookingStatus('ERROR');
            }
        } catch (err: any) {
            console.error('Booking Exception:', err);
            setBookingStatus('ERROR');
            alert(`Booking Error: ${err.message || 'Unknown error'}`);
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

    if (!show) return (
        <Layout>
            <div className="flex flex-col justify-center items-center h-96 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Show Not Found</h2>
                <p className="text-gray-600 mb-8">The show you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                    Go Back Home
                </button>
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
    // AND "Implement seat selection in the z with direct DOM updates for highlighting selected seats"
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
            <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Shows
            </button>

            <div className="glass rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                {/* Left: Info */}
                <div className="lg:w-1/3 bg-white/5 border-r border-white/10 p-10 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-3 text-white">{show.name}</h1>
                        <p className="text-indigo-300 text-lg mb-8 font-medium">{new Date(show.start_time).toLocaleString()}</p>

                        <div className="space-y-6 bg-black/20 p-6 rounded-2xl">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-gray-400">Total Seats</span>
                                <span className="font-mono text-xl text-white">{show.total_seats}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Available</span>
                                <span className="font-mono text-xl text-emerald-400">{show.available_seats}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400">Selected Seats</span>
                            <span className="text-3xl font-bold text-white">{selectedSeatCount}</span>
                        </div>

                        <button
                            onClick={handleBook}
                            disabled={selectedSeatCount === 0 || processing || bookingStatus === 'SUCCESS'}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] shadow-lg",
                                bookingStatus === 'SUCCESS' ? "bg-emerald-500 text-white shadow-emerald-500/25" :
                                    bookingStatus === 'ERROR' ? "bg-red-500 text-white shadow-red-500/25" :
                                        selectedSeatCount > 0
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30"
                                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
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
                                `Confirm Booking`
                            )}
                        </button>
                        {bookingStatus === 'ERROR' && (
                            <p className="text-red-400 text-sm mt-3 text-center bg-red-500/10 py-2 rounded-lg">Booking failed. Seats might be taken.</p>
                        )}
                    </div>
                </div>

                {/* Right: Seat Grid */}
                <div className="flex-1 p-10 bg-black/20 overflow-y-auto max-h-[80vh]">
                    <h2 className="text-2xl font-bold text-white mb-8">Select Your Seats</h2>

                    <div className="flex justify-center gap-8 mb-10 text-sm">
                        <div className="flex items-center text-gray-400"><div className="w-4 h-4 bg-white/10 rounded mr-3" /> Booked</div>
                        <div className="flex items-center text-gray-400"><div className="w-4 h-4 bg-white/20 border border-white/30 rounded mr-3" /> Available</div>
                        <div className="flex items-center text-white font-medium"><div className="w-4 h-4 bg-indigo-500 rounded mr-3 shadow-lg shadow-indigo-500/50" /> Selected</div>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-w-3xl mx-auto perspective-1000">
                        {Array.from({ length: totalSeats }).map((_, idx) => {
                            const isBooked = idx < bookedCount;
                            const isSelected = selectedIndices.has(idx);

                            return (
                                <button
                                    key={idx}
                                    disabled={isBooked}
                                    onClick={() => toggleSeat(idx)}
                                    className={clsx(
                                        "aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 relative",
                                        isBooked
                                            ? "bg-white/5 text-gray-600 cursor-not-allowed"
                                            : isSelected
                                                ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/40 scale-110 ring-2 ring-indigo-300 z-10"
                                                : "bg-white/10 border border-white/10 text-gray-400 hover:bg-white/20 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10 hover:text-white"
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-16 w-full h-24 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-[100%] flex justify-center items-end pb-4 opacity-50 blur-xl pointer-events-none animate-[pulseGlow_4s_infinite]">
                    </div>
                    <div className="text-center text-indigo-300/50 text-sm uppercase tracking-[0.3em] -mt-8 font-medium animate-pulse">Screen</div>
                </div>
            </div>
        </Layout>
    );
};
