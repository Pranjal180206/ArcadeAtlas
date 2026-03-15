import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, UserCircle, LogOut, PlusCircle } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-card/80 backdrop-blur-md border-b border-indigo-500/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <Gamepad2 className="w-8 h-8 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                GameLib
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/add"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all glow-hover border border-indigo-500/30"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add Game</span>
                        </Link>

                        <Link
                            to="/profile"
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                        >
                            <UserCircle className="w-6 h-6" />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
