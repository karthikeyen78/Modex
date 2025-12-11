import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Armchair, ArrowRight } from 'lucide-react';
import type { Show } from '../types';
import clsx from 'clsx';

export const ShowCard: React.FC<{ show: Show }> = ({ show }) => {
    const isAvailable = (show.available_seats || 0) > 0;

    return (
        <div className="glass rounded-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col h-full group hover:shadow-indigo-500/10 hover:border-indigo-500/30">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {show.name}
                    </h3>
                    <span className={clsx(
                        "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
                        isAvailable
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                            : "bg-red-500/20 text-red-300 border border-red-500/20"
                    )}>
                        {isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                </div>

                <div className="space-y-4 text-gray-400 text-sm">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                        {new Date(show.start_time).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                        <Armchair className="w-4 h-4 mr-2 text-indigo-400" />
                        <span className="text-gray-300">{show.available_seats} seats left</span>
                        <span className="text-gray-600 mx-2">/</span>
                        <span>{show.total_seats} total</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5">
                <Link
                    to={`/booking/${show.id}`}
                    className={clsx(
                        "block w-full text-center py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center",
                        isAvailable
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/25"
                            : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    )}
                    onClick={(e) => !isAvailable && e.preventDefault()}
                >
                    {isAvailable ? 'Book Seats' : 'Full'}
                    {isAvailable && <ArrowRight className="w-4 h-4 ml-2" />}
                </Link>
            </div>
        </div>
    );
};
