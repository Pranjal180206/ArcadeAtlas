import { useState, useEffect } from 'react';
import { Gamepad2, AlertCircle, PlusCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';
import api from '../services/api';

export default function Dashboard() {
    const [gamesState, setGamesState] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchGames = async () => {
        try {
            const res = await api.get('/games');
            setGamesState(res.data);
        } catch (err) {
            setError('Failed to load games library.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            try {
                await api.delete(`/games/${id}`);
                setGamesState(gamesState.filter((g) => g._id !== id));
            } catch (err) {
                alert('Failed to delete game.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Your Library</h1>
                        <p className="text-zinc-400">Track and manage your entire gaming collection.</p>
                    </div>
                    <Link
                        to="/add"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all glow-hover shadow-lg shadow-indigo-500/25"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Add New Game</span>
                    </Link>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {gamesState.length === 0 && !error ? (
                    <div className="bg-card border border-white/5 rounded-2xl p-12 text-center text-zinc-400">
                        <div className="flex justify-center mb-4">
                            <Gamepad2 className="w-16 h-16 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Library is empty</h3>
                        <p className="mb-6 max-w-sm mx-auto">
                            You haven't added any games yet. Start tracking your journey by adding your first game.
                        </p>
                        <Link
                            to="/add"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors border border-white/10"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Add Your First Game</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {gamesState.map((game) => (
                            <GameCard key={game._id} game={game} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
