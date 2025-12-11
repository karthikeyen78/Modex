import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Armchair, ArrowRight } from 'lucide-react';
import type { Show } from '../types';
import clsx from 'clsx';

export const ShowCard: React.FC<{ show: Show }> = ({ show }) => {
    const isAvailable = (show.available_seats || 0) > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full group">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {show.name}
                    </h3>
                    <span className={clsx(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium",
                        isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}>
                        {isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                </div>

                <div className="space-y-3 text-gray-500 text-sm">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(show.start_time).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                        <Armchair className="w-4 h-4 mr-2" />
                        <span>{show.available_seats} seats left</span>
                        <span className="text-gray-300 mx-2">/</span>
                        <span>{show.total_seats} total</span>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100">
                <Link
                    to={`/booking/${show.id}`}
                    className={clsx(
                        "block w-full text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center",
                        isAvailable
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
