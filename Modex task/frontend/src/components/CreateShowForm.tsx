import React, { useState } from 'react';
import { createShow } from '../api/shows';
import { Plus, Calendar, Armchair, Tag, Loader2 } from 'lucide-react';
import type { CreateShowPayload } from '../types';

export const CreateShowForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<CreateShowPayload>({
        name: '',
        start_time: '',
        total_seats: 40,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createShow(formData);
            setFormData({ name: '', start_time: '', total_seats: 40 });
            onSuccess();
        } catch (err) {
            setError('Failed to create show. Check inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-8 flex items-center">
                <Plus className="w-6 h-6 mr-3 text-indigo-400" />
                Create New Show
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Show Name</label>
                    <div className="relative group">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-glass pl-10 block w-full rounded-xl py-3 px-4 outline-none"
                            placeholder="e.g. Interstellar IMAX"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="datetime-local"
                                required
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                className="input-glass pl-10 block w-full rounded-xl py-3 px-4 outline-none [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Total Seats</label>
                        <div className="relative group">
                            <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="number"
                                min="1"
                                required
                                value={formData.total_seats}
                                onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) })}
                                className="input-glass pl-10 block w-full rounded-xl py-3 px-4 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Show'
                    )}
                </button>
            </form>
        </div>
    );
};

