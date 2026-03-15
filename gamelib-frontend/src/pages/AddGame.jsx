import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GameForm from '../components/GameForm';
import api from '../services/api';

export default function AddGame() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        setError('');
        try {
            await api.post('/games', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add game.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                )}
                <GameForm onSubmit={handleSubmit} isLoading={isLoading} buttonText="Add to Library" />
            </main>
        </div>
    );
}
