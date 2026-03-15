import { Link } from 'react-router-dom';
import { Gamepad2, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="relative mb-8">
                <Gamepad2 className="w-32 h-32 text-indigo-500/20" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-indigo-500">
                    404
                </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Level Not Found</h1>
            <p className="text-zinc-400 text-lg mb-8 text-center max-w-md">
                The page you're looking for has been deleted, moved, or never existed in this dimension.
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all glow-hover"
            >
                <Home className="w-5 h-5" />
                Return to Base
            </Link>
        </div>
    );
}
