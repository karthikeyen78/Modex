import React, { useEffect, useState } from 'react';
import { getShows } from '../api/shows';
import type { Show } from '../types';
import { ShowCard } from '../components/ShowCard';
import { Layout } from '../components/Layout';
import { Search } from 'lucide-react';

export const UserDashboard: React.FC = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const data = await getShows();
                setShows(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShows();
    }, []);

    const filteredShows = shows.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Layout>
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Book Your Next Experience
                </h1>
                <p className="text-lg text-gray-600">
                    Secure seats for movies, trips, and events in real-time.
                </p>
            </div>

            <div className="mb-8 max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search shows..."
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredShows.map((show) => (
                        <ShowCard key={show.id} show={show} />
                    ))}
                    {filteredShows.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No shows found matching your search.
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};
