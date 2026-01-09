import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Star, Users, Calendar, TrendingUp, Award, Clock, Store as StoreIcon, Plus, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const OwnerDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noStore, setNoStore] = useState(false);
    const [sortField, setSortField] = useState('date');
    const [sortDir, setSortDir] = useState('desc');

    // Store Creation Form State
    const [storeForm, setStoreForm] = useState({
        name: '',
        email: '',
        address: ''
    });
    const [creatingStore, setCreatingStore] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get('/owner/dashboard');
            setData(res.data);
            setNoStore(false);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                setNoStore(true);
            } else {
                toast.error('Failed to load dashboard metrics');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        setCreatingStore(true);
        try {
            await api.post('/owner/store', storeForm);
            toast.success('Your store has been successfully registered!');
            await fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create store');
        } finally {
            setCreatingStore(false);
        }
    };

    const sortedReviewers = data?.reviewers ? [...data.reviewers].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'date') {
            valA = new Date(valA);
            valB = new Date(valB);
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (sortDir === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
    }) : [];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assembling Business Metrics...</p>
        </div>
    );

    if (noStore) return (
        <div className="p-10 max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-10 space-y-8"
            >
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 ring-8 ring-primary-50/50">
                        <StoreIcon size={40} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Register Your Shop</h2>
                    <p className="text-slate-500 font-medium italic">You haven't linked a store to your account yet. Let's get started!</p>
                </div>

                <form onSubmit={handleCreateStore} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Business Name</label>
                        <div className="relative group">
                            <StoreIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            <input
                                required
                                minLength={3}
                                maxLength={60}
                                type="text"
                                placeholder="e.g. The Artisanal Coffee House"
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-900 font-bold outline-none focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                value={storeForm.name}
                                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Public Contact Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            <input
                                required
                                type="email"
                                placeholder="hello@yourbusiness.com"
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-900 font-bold outline-none focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                value={storeForm.email}
                                onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Store Address</label>
                        <div className="relative group">
                            <MapPin className="absolute left-5 top-8 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                            <textarea
                                required
                                minLength={10}
                                maxLength={400}
                                placeholder="Enter full physical address..."
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-900 font-bold outline-none focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all min-h-[120px]"
                                value={storeForm.address}
                                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        disabled={creatingStore}
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-premium hover:shadow-primary-500/20 transition-all flex items-center justify-center gap-3 group"
                    >
                        {creatingStore ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                Initiate My Business Profile
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                        <Award size={14} /> Operational Excellence
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">{data.storeName}</h1>
                    <p className="text-slate-500 font-medium text-lg italic">Real-time performance analytics and reviewer engagement.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-premium ring-1 ring-slate-100">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Status</p>
                        <p className="text-sm font-bold text-slate-900">Live on Platform</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-0 overflow-hidden relative group md:col-span-2"
                >
                    <div className="bg-gradient-to-br from-primary-600 to-primary-900 p-8 text-white h-full">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">Core Reputation Score</h2>
                            <Star size={32} className="opacity-20 group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <div className="flex items-baseline gap-4 mt-auto">
                            <span className="text-7xl font-black tracking-tighter">{data.averageRating}</span>
                            <span className="text-2xl font-bold opacity-50">/ 5.0 Rating</span>
                        </div>
                        <div className="mt-8 flex gap-2">
                            {[1, 2, 3, 4, 5].map(i => {
                                const rating = parseFloat(data.averageRating);
                                const isFull = i <= Math.floor(rating);
                                const isHalf = !isFull && i === Math.ceil(rating) && (rating % 1 >= 0.5);
                                return (
                                    <Star
                                        key={i}
                                        size={20}
                                        fill={isFull ? "currentColor" : "none"}
                                        className={isFull ? "opacity-100" : isHalf ? "opacity-60" : "opacity-20"}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card flex flex-col justify-between p-8"
                >
                    <div className="flex justify-between items-center text-slate-400">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">User Engagement</h2>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <Users size={22} />
                        </div>
                    </div>
                    <div>
                        <p className="text-5xl font-black text-slate-900 leading-none mb-1">{data.reviewers.length}</p>
                        <p className="text-sm font-bold text-slate-400">Total Unique Reviewers</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="card flex flex-col justify-between p-8"
                >
                    <div className="flex justify-between items-center text-slate-400">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Review</h2>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <Clock size={22} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900 leading-tight mb-1 truncate">
                            {data.reviewers[0]?.name || 'N/A'}
                        </p>
                        <p className="text-sm font-bold text-slate-400">
                            {data.reviewers[0] ? new Date(data.reviewers[0].date).toLocaleDateString() : 'Waiting for ratings'}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Community Feedback</h2>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
                        <select
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none ring-primary-500/10 focus:ring-4 transition-all appearance-none cursor-pointer pr-10"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                            value={`${sortField}-${sortDir}`}
                            onChange={(e) => {
                                const [field, dir] = e.target.value.split('-');
                                setSortField(field);
                                setSortDir(dir);
                            }}
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="rating-desc">Highest Rating</option>
                            <option value="rating-asc">Lowest Rating</option>
                            <option value="name-asc">Reviewer Name (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {sortedReviewers.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold">Your directory is currently empty. Encourage customers to rate you!</p>
                        </div>
                    ) : (
                        sortedReviewers.map((rev, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group p-6 bg-white rounded-2xl ring-1 ring-slate-100 hover:ring-primary-100 hover:shadow-premium transition-all flex flex-col md:flex-row justify-between items-center gap-6"
                            >
                                <div className="flex gap-5 items-center w-full md:w-auto">
                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100 group-hover:from-primary-50 group-hover:to-primary-100 group-hover:text-primary-600 transition-all">
                                        {rev.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg group-hover:text-primary-600 transition-colors leading-tight">{rev.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rev.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-center md:text-right">
                                        <div className="flex items-center gap-2 text-amber-500 font-black text-2xl mb-1">
                                            <Star size={24} fill="currentColor" /> {rev.rating}.0
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            <Calendar size={12} />
                                            {new Date(rev.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
