import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load Pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AddGame = lazy(() => import('./pages/AddGame'));
const EditGame = lazy(() => import('./pages/EditGame'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Global styles are imported in main.jsx

const FallbackLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-dark">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
    </div>
);

// Global styles are imported in main.jsx

function App() {
    return (
        <Router>
            <AuthProvider>
                <Suspense fallback={<FallbackLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/add"
                            element={
                                <ProtectedRoute>
                                    <AddGame />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit/:id"
                            element={
                                <ProtectedRoute>
                                    <EditGame />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
}

export default App;
