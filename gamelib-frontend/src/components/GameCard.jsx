import { Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, Clock, PlayCircle } from 'lucide-react';

export default function GameCard({ game, onDelete }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Completed':
                return { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle };
            case 'Playing':
                return { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: PlayCircle };
            case 'Backlog':
            case 'Dropped':
            default:
                return { color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: Clock };
        }
    };

    const statusConfig = getStatusConfig(game.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="bg-card rounded-xl border border-white/5 overflow-hidden group hover:-translate-y-1 transition-all duration-300 glow-hover flex flex-col h-full">
            <div className="aspect-[3/4] overflow-hidden relative">
                {game.cover_url ? (
                    <img
                        src={game.cover_url}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = '/assets/placeholder-game.png';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-500 font-medium">No Cover</span>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/90 to-transparent p-4 pt-12">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{game.status}</span>
                        </span>
                        {game.completion_count > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {game.completion_count}x Completed
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div>
                    <h3 className="font-bold text-lg text-white leading-tight mb-1 truncate">{game.title}</h3>
                    <p className="text-zinc-400 text-sm font-medium">{game.platform}</p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <Link
                        to={`/edit/${game._id}`}
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                    </Link>
                    <button
                        onClick={() => onDelete(game._id, game.title)}
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
