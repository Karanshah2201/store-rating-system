import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, MapPin, Star, Sparkles, Navigation, Heart, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserStoreList = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [hoveredStore, setHoveredStore] = useState(null);
    const [sortField, setSortField] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get('/user/stores');
            setStores(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRating = async (storeId, rating) => {
        try {
            await api.post('/user/rate', { storeId, rating });
            fetchStores();
        } catch (err) {
            console.error('Failed to submit rating');
        }
    };

    const sortedStores = [...stores]
        .filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortField === 'rating') {
                const valA = parseFloat(a.overallRating) || 0;
                const valB = parseFloat(b.overallRating) || 0;
                return sortDir === 'asc' ? valA - valB : valB - valA;
            } else {
                const valA = a.name.toLowerCase();
                const valB = b.name.toLowerCase();
                if (sortDir === 'asc') return valA > valB ? 1 : -1;
                return valA < valB ? 1 : -1;
            }
        });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-primary-600 rounded-full animate-spin mb-6" />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Curating Local Favorites...</p>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-3">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                    >
                        <Sparkles size={14} /> Explorer Mode
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Discover Stores</h1>
                    <p className="text-slate-500 font-medium text-lg">Browse the best rated establishments in your area.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search establishments..."
                            className="input-field pl-12 shadow-premium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="input-field md:w-48 shadow-premium appearance-none bg-white cursor-pointer font-bold text-slate-600"
                        value={`${sortField}-${sortDir}`}
                        onChange={(e) => {
                            const [field, dir] = e.target.value.split('-');
                            setSortField(field);
                            setSortDir(dir);
                        }}
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="rating-desc">Highest Rated</option>
                        <option value="rating-asc">Lowest Rated</option>
                    </select>
                </div>
            </header>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence>
                    {sortedStores.map((store, i) => (
                        <motion.div
                            key={store.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onMouseEnter={() => setHoveredStore(store.id)}
                            onMouseLeave={() => setHoveredStore(null)}
                            className="card group flex flex-col items-start h-full border-none relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <Heart size={20} />
                                </button>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100">
                                        {store.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{store.name}</h3>
                                        <div className="flex items-center gap-1.5 text-amber-500 font-black">
                                            <Star size={16} fill="currentColor" />
                                            <span>{store.overallRating || 'New'}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">Platform Avg</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 text-slate-500 text-sm mb-8 bg-slate-50 p-4 rounded-2xl">
                                    <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                    <p className="font-medium leading-relaxed">{store.address}</p>
                                </div>
                            </div>

                            <div className="w-full space-y-4 pt-6 mt-auto border-t border-slate-50">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        {store.userSubmittedRating ? 'Your Experience' : 'Rate Your Experience'}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-1.5 w-full">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            onClick={() => handleRating(store.id, star)}
                                            className={`flex-1 aspect-square rounded-xl font-black text-sm transition-all relative overflow-hidden ${store.userSubmittedRating === star
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40'
                                                : 'bg-slate-50 text-slate-400 hover:bg-primary-50 hover:text-primary-600 hover:scale-105 active:scale-95'
                                                }`}
                                        >
                                            {star}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {sortedStores.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No establishments found</h3>
                    <p className="text-slate-400 font-medium">Try broadening your search criteria or searching by zip code.</p>
                </div>
            )}
        </div>
    );
};

export default UserStoreList;
