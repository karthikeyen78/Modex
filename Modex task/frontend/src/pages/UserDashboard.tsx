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
            <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
                <h1 className="text-5xl font-black text-white tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300 drop-shadow-sm">
                    Book Your Next Experience
                </h1>
                <p className="text-xl text-indigo-200/80 font-medium">
                    Secure seats for movies, trips, and events in real-time.
                </p>
            </div>

            <div className="mb-12 max-w-xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search shows..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl input-glass outline-none transition-all duration-300 shadow-lg"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 mx-auto"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredShows.map((show, idx) => (
                        <div key={show.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-[fadeInUp_0.5s_ease-out_forwards] opacity-0">
                            <ShowCard show={show} />
                        </div>
                    ))}
                    {filteredShows.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400 glass rounded-2xl">
                            <p className="text-lg">No shows found matching your search.</p>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};
