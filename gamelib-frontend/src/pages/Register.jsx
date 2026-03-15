import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, login, googleLogin, user } = useAuth();
    const navigate = useNavigate();

    if (user) return <Navigate to="/dashboard" replace />;

    const validate = () => {
        const errors = {};
        if (!email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
        
        if (!password) errors.password = 'Password is required';
        else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
        
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setIsLoading(true);
        try {
            await register(email, password);
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to register. Email may already be in use.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-md bg-card/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl z-10">
                <div className="flex justify-center mb-6">
                    <Gamepad2 className="w-16 h-16 text-purple-500" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
                <p className="text-zinc-400 text-center mb-8">Start your game library journey today.</p>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-dark border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600`}
                            placeholder="gamer@example.com"
                            required
                        />
                        {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-dark border ${fieldErrors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600`}
                            placeholder="••••••••"
                            required
                        />
                        {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-dark border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600`}
                            placeholder="••••••••"
                            required
                        />
                        {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-xl font-semibold transition-all glow-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-zinc-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            setError('');
                            setIsLoading(true);
                            try {
                                await googleLogin(credentialResponse.credential);
                                navigate('/dashboard');
                            } catch (err) {
                                setError(err.response?.data?.detail || 'Google sign-up failed.');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        onError={() => setError('Google sign-up failed.')}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        width="380"
                        text="signup_with"
                    />
                </div>

                <p className="mt-8 text-center text-zinc-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
