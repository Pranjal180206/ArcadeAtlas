import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Clock, Image as ImageIcon } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="z-10 text-center max-w-4xl mx-auto">
                <div className="mb-8 flex justify-center">
                    <Gamepad2 className="w-24 h-24 text-indigo-500" />
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    GameLib Tracker
                </h1>
                <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Your personal gaming journey, organized. Track what you play, what you beat, and what's next.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
                    <Link
                        to="/register"
                        className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all glow-hover shadow-lg shadow-indigo-500/25 w-full sm:w-auto"
                    >
                        Start Tracking
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 rounded-xl bg-card hover:bg-zinc-800 text-white font-bold text-lg transition-all border border-white/10 w-full sm:w-auto"
                    >
                        Sign In
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 rounded-2xl bg-card border border-white/5 relative group hover:-translate-y-2 transition-all duration-300 hover:border-indigo-500/50">
                        <Trophy className="w-10 h-10 text-emerald-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-white">Track Completions</h3>
                        <p className="text-zinc-400">Log every time you beat a game and watch your completion library grow.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-white/5 relative group hover:-translate-y-2 transition-all duration-300 hover:border-purple-500/50">
                        <Clock className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-white">Manage Backlog</h3>
                        <p className="text-zinc-400">Never forget what you want to play next with dedicated backlog tracking.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-white/5 relative group hover:-translate-y-2 transition-all duration-300 hover:border-indigo-500/50">
                        <ImageIcon className="w-10 h-10 text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2 text-white">Visual Library</h3>
                        <p className="text-zinc-400">Build a beautiful grid of game covers representing your unique journey.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
