import { useState } from 'react';
import { ArrowLeft, Loader2, Save, Plus, Trash2, Calendar, Clock as ClockIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLATFORMS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Mobile', 'Other'];
const STATUSES = ['Playing', 'Completed', 'Dropped', 'Backlog'];

export default function GameForm({ initialData = null, onSubmit, isLoading, buttonText }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        cover_url: initialData?.cover_url || '',
        platform: initialData?.platform || 'PC',
        completion_count: initialData?.completion_count || 0,
        status: initialData?.status || 'Backlog',
        sessions: initialData?.sessions || []
    });
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'completion_count' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSessionChange = (index, field, value) => {
        const newSessions = [...formData.sessions];
        newSessions[index] = {
            ...newSessions[index],
            [field]: field === 'hours_played' ? parseFloat(value) || 0 : value
        };
        setFormData({ ...formData, sessions: newSessions });
    };

    const addSession = () => {
        setFormData({
            ...formData,
            sessions: [
                ...formData.sessions,
                { start_date: new Date().toISOString().split('T')[0], end_date: new Date().toISOString().split('T')[0], hours_played: 0 }
            ]
        });
    };

    const removeSession = (index) => {
        setFormData({
            ...formData,
            sessions: formData.sessions.filter((_, i) => i !== index)
        });
    };

    const validate = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (formData.completion_count < 0) errors.completion_count = 'Completion count cannot be negative';
        
        const sessionErrors = {};
        formData.sessions.forEach((s, idx) => {
            if (s.hours_played < 0) sessionErrors[idx] = 'Hours cannot be negative';
            else if (new Date(s.end_date) < new Date(s.start_date)) sessionErrors[idx] = 'End date cannot be before start date';
        });
        if (Object.keys(sessionErrors).length > 0) errors.sessions = sessionErrors;
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(formData);
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
            </Link>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {initialData ? 'Edit Game Details' : 'Add New Game'}
                </h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="title">Title <span className="text-red-400">*</span></label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full bg-dark border ${fieldErrors.title ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600`}
                                placeholder="e.g. Elden Ring"
                                required
                            />
                            {fieldErrors.title && <p className="mt-1 text-xs text-red-500">{fieldErrors.title}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="cover_url">Cover Image URL</label>
                            <input
                                id="cover_url"
                                name="cover_url"
                                type="url"
                                value={formData.cover_url}
                                onChange={handleChange}
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="platform">Platform</label>
                            <select
                                id="platform"
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                            >
                                {PLATFORMS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none capitalize"
                            >
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="completion_count">Completion Count</label>
                            <input
                                id="completion_count"
                                name="completion_count"
                                type="number"
                                min="0"
                                value={formData.completion_count}
                                onChange={handleChange}
                                className={`w-full bg-dark border ${fieldErrors.completion_count ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            />
                            {fieldErrors.completion_count && <p className="mt-1 text-xs text-red-500">{fieldErrors.completion_count}</p>}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Play Sessions</h3>
                            <button
                                type="button"
                                onClick={addSession}
                                className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Session</span>
                            </button>
                        </div>

                        {formData.sessions.length === 0 ? (
                            <p className="text-zinc-500 text-sm italic">No sessions logged yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {formData.sessions.map((session, index) => (
                                    <div key={index} className="bg-dark/50 p-4 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 relative group">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={session.start_date}
                                                onChange={(e) => handleSessionChange(index, 'start_date', e.target.value)}
                                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={session.end_date}
                                                onChange={(e) => handleSessionChange(index, 'end_date', e.target.value)}
                                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" /> Hours
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    min="0"
                                                    value={session.hours_played}
                                                    onChange={(e) => handleSessionChange(index, 'hours_played', e.target.value)}
                                                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSession(index)}
                                                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        {fieldErrors.sessions && fieldErrors.sessions[index] && (
                                            <p className="mt-2 text-xs text-red-500 col-span-1 sm:col-span-3">{fieldErrors.sessions[index]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={isLoading || !formData.title}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold transition-all glow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{buttonText}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
