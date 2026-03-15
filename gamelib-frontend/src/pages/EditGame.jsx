import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import GameForm from '../components/GameForm';
import api from '../services/api';

export default function EditGame() {
    const { id } = useParams();
    const [initialData, setInitialData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await api.get(`/games/${id}`);
                if (res.data) {
                    setInitialData(res.data);
                } else {
                    setError('Game not found.');
                }
            } catch (err) {
                setError('Failed to fetch game details.');
            } finally {
                setIsFetching(false);
            }
        };
        fetchGame();
    }, [id]);

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        setError('');
        try {
            await api.put(`/games/${id}`, formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update game.');
            setIsLoading(false);
        }
    };

    if (isFetching) {
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
                {error ? (
                    <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                ) : (
                    <GameForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        buttonText="Save Changes"
                    />
                )}
            </main>
        </div>
    );
}
