import { useAuth } from '../context/AuthContext';
import { LogOut, User, Store, Settings, Bell } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { label: 'Dashboard', path: user.role === 'Admin' ? '/admin' : user.role === 'StoreOwner' ? '/owner' : '/user' },
        { label: 'Settings', path: '/update-password' },
    ];

    return (
        <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-white/40 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 font-extrabold text-2xl text-primary-600 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                        <Store size={24} />
                    </div>
                    <span className="tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-900">Raxilor</span>
                </motion.div>

                <div className="flex items-center gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="h-6 w-px bg-slate-200 mx-3" />

                    <div className="flex items-center gap-4 pl-2">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-bold text-slate-900">{user.name}</span>
                            <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded-full ring-1 ring-primary-100">
                                {user.role}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Logout"
                        >
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
