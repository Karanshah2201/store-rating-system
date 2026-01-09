import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Store, Star, Search, Filter, Plus, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddStore, setShowAddStore] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'User' });
    const [storeData, setStoreData] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/users'),
                api.get('/admin/stores')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setStores(storesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', formData);
            setMessage({ text: 'User added successfully!', type: 'success' });
            setShowAddUser(false);
            setFormData({ name: '', email: '', password: '', address: '', role: 'User' });
            fetchData();
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Failed to add user', type: 'error' });
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/stores', storeData);
            setMessage({ text: 'Store added successfully!', type: 'success' });
            setShowAddStore(false);
            setStoreData({ name: '', email: '', address: '', ownerId: '' });
            fetchData();
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Failed to add store', type: 'error' });
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const sortedUsers = [...users]
        .filter(u =>
            u.name.toLowerCase().includes(filter.toLowerCase()) ||
            u.email.toLowerCase().includes(filter.toLowerCase()) ||
            u.address.toLowerCase().includes(filter.toLowerCase()) ||
            u.role.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => {
            const valA = a[sortField] || '';
            const valB = b[sortField] || '';
            return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

    const sortedStores = [...stores]
        .filter(s =>
            s.name.toLowerCase().includes(filter.toLowerCase()) ||
            s.address.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => {
            const valA = a[sortField] || '';
            const valB = b[sortField] || '';
            if (typeof valA === 'number') return sortDir === 'asc' ? valA - valB : valB - valA;
            return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Data...</p>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">System Control</h1>
                    <p className="text-slate-500 font-medium">Manage users, stores and monitor platform health</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setShowAddUser(true)} className="btn-secondary group">
                        <Plus size={20} className="inline mr-2 group-hover:rotate-90 transition-transform" /> Add User
                    </button>
                    <button onClick={() => setShowAddStore(true)} className="btn-primary group">
                        <Plus size={20} className="inline mr-2 group-hover:rotate-90 transition-transform" /> Add Store
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-2xl flex items-center justify-between font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-red-50 text-red-700 ring-1 ring-red-100'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                            {message.text}
                        </div>
                        <button onClick={() => setMessage({ text: '', type: '' })}><X size={20} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'primary' },
                    { label: 'Active Stores', value: stats.totalStores, icon: Store, color: 'emerald' },
                    { label: 'Ratings Given', value: stats.totalRatings, icon: Star, color: 'amber' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group card overflow-hidden relative"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500 opacity-50`} />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className={`p-4 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white/40 backdrop-blur-md p-2 rounded-[2rem] ring-1 ring-slate-200/50">
                <div className="bg-white rounded-[1.5rem] shadow-premium overflow-hidden border border-slate-100">
                    <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                        <Search className="text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search platform resources by name, email or role..."
                            className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    <div className="p-8 space-y-12">
                        {/* Users Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Users size={20} className="text-primary-500" /> User Management
                                </h2>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{sortedUsers.length} Users</span>
                            </div>
                            <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-5 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort('name')}>
                                                User Information {sortField === 'name' && (sortDir === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                                            </th>
                                            <th className="px-6 py-5 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort('role')}>
                                                Platform Role {sortField === 'role' && (sortDir === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                                            </th>
                                            <th className="px-6 py-5">Ratings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {sortedUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-primary-50/30 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center font-black text-slate-500 text-xs">
                                                            {user.name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{user.name}</div>
                                                            <div className="text-xs font-medium text-slate-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' :
                                                            user.role === 'StoreOwner' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {user.rating ? (
                                                        <div className="flex items-center gap-1.5 text-amber-500 font-black text-sm bg-amber-50 px-3 py-1 rounded-full w-fit">
                                                            <Star size={14} fill="currentColor" /> {user.rating}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs font-medium">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Stores Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Store size={20} className="text-emerald-500" /> Active Directories
                                </h2>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{sortedStores.length} Stores</span>
                            </div>
                            <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-100">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => handleSort('name')}>
                                                Store Entity {sortField === 'name' && (sortDir === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                                            </th>
                                            <th className="px-6 py-5">Primary Address</th>
                                            <th className="px-6 py-5 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => handleSort('rating')}>
                                                Avg. Rating {sortField === 'rating' && (sortDir === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {sortedStores.map(store => (
                                            <tr key={store.id} className="hover:bg-emerald-50/30 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{store.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{store.email}</div>
                                                </td>
                                                <td className="px-6 py-5 text-xs font-medium text-slate-500 max-w-sm truncate">{store.address}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full w-fit">
                                                        <Star size={14} fill="currentColor" /> {store.rating}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showAddUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl space-y-8"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-slate-900">New User</h2>
                                <button onClick={() => setShowAddUser(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <input type="text" placeholder="Full Name" required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <input type="email" placeholder="Work Email" required className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input type="password" placeholder="System Password" required className="input-field" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                <textarea placeholder="Physical Address" required className="input-field h-24 pt-3 resize-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                <select className="input-field appearance-none cursor-pointer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="User">Normal User</option>
                                    <option value="Admin">Administrator</option>
                                    <option value="StoreOwner">Store Owner</option>
                                </select>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="btn-primary flex-1 py-4">Confirm Creation</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {showAddStore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl space-y-8"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-slate-900">New Store</h2>
                                <button onClick={() => setShowAddStore(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleAddStore} className="space-y-4">
                                <input type="text" placeholder="Legal Entity Name" required className="input-field" value={storeData.name} onChange={(e) => setStoreData({ ...storeData, name: e.target.value })} />
                                <input type="email" placeholder="Business Service Email" required className="input-field" value={storeData.email} onChange={(e) => setStoreData({ ...storeData, email: e.target.value })} />
                                <textarea placeholder="Operation HQ Address" required className="input-field h-24 pt-3 resize-none" value={storeData.address} onChange={(e) => setStoreData({ ...storeData, address: e.target.value })} />
                                <select className="input-field appearance-none cursor-pointer" value={storeData.ownerId} onChange={(e) => setStoreData({ ...storeData, ownerId: e.target.value })}>
                                    <option value="">Search Owner Identity...</option>
                                    {users.filter(u => u.role === 'StoreOwner').map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700 flex-1 py-4">Deploy Store</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
