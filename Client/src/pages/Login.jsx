import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'Admin') navigate('/admin');
            else if (user.role === 'StoreOwner') navigate('/owner');
            else navigate('/user');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-76px)] flex items-center justify-center p-6 bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full"
            >
                <div className="glass p-12 rounded-[3rem] relative overflow-hidden">
                    <div className="text-center mb-12 relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
                            className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-primary-600 to-primary-400 text-white rounded-[2rem] shadow-2xl shadow-primary-500/40 mb-8"
                        >
                            <Store size={40} strokeWidth={2.5} />
                        </motion.div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Back</h1>
                        <p className="text-slate-400 font-semibold px-4 tracking-tight">Elevate your store experience with Raxilor</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl mb-8 text-sm font-bold flex items-center gap-4"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="label-premium">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="label-premium">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-5 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-100/50 text-center relative z-10">
                        <p className="text-slate-500 font-bold tracking-tight">
                            New to the platform?{' '}
                            <Link to="/signup" className="text-primary-600 font-black hover:text-primary-500 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
