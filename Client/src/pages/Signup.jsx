import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        role: 'User',
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);
        try {
            const user = await signup(formData);
            if (user.role === 'StoreOwner') navigate('/owner');
            else navigate('/user');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors.map(e => e.msg));
            } else {
                setErrors([err.response?.data?.message || 'Signup failed']);
            }
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
                className="max-w-2xl w-full"
            >
                <div className="glass p-12 rounded-[3.5rem] relative overflow-hidden">
                    <div className="text-center mb-12 relative z-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Create Account</h1>
                        <p className="text-slate-400 font-semibold text-lg tracking-tight">Join the world's most trusted store rating platform</p>
                    </div>

                    {errors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl mb-10 text-sm shadow-sm"
                        >
                            <ul className="space-y-2">
                                {errors.map((err, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                                        {err}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 relative z-10">
                        <div className="md:col-span-2 space-y-2">
                            <label className="label-premium">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Min 3 characters"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="label-premium">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="label-premium">Secure Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="8-16 chars, 1 Upper, 1 Special"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="label-premium">Physical Address</label>
                            <textarea
                                required
                                className="input-field h-32 pt-5 resize-none"
                                placeholder="Street, City, Zip Code (Max 400 chars)"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="label-premium">Register As</label>
                            <select
                                className="input-field appearance-none cursor-pointer font-bold text-slate-700"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="User">Normal User (Rate Stores)</option>
                                <option value="StoreOwner">Store Owner (Manage Store)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 text-lg"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Create My Account"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-100/50 text-center relative z-10">
                        <p className="text-slate-500 font-bold tracking-tight">
                            Already a member?{' '}
                            <Link to="/login" className="text-primary-600 font-black hover:text-primary-500 transition-colors">
                                Sign in instead
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
