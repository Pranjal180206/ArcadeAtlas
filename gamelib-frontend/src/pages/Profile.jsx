import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Trophy, Gamepad2, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Profile() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, completed: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/auth/me/stats');
                setStats(res.data);
            } catch (err) {
                setError('Failed to load profile statistics.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-card rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
                            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                                <UserCircle className="w-20 h-20 text-zinc-400" />
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">Player Profile</h1>
                            <p className="text-xl text-zinc-400 font-medium">{user?.email}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <div className="bg-dark rounded-2xl p-6 border border-white/5 flex items-center gap-6">
                            <div className="p-4 rounded-xl bg-indigo-500/10 text-indigo-400">
                                <Gamepad2 className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-zinc-400 font-medium mb-1">Total Games</p>
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                ) : (
                                    <p className="text-4xl font-bold text-white">{stats.total}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-dark rounded-2xl p-6 border border-white/5 flex items-center gap-6">
                            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-zinc-400 font-medium mb-1">Completed Games</p>
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                                ) : (
                                    <p className="text-4xl font-bold text-white">{stats.completed}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
