import { useState } from 'react';
import api from '../api/axios';
import { Lock, Save, AlertCircle } from 'lucide-react';

const UpdatePassword = () => {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }

        try {
            await api.put('/auth/update-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ text: 'Password updated successfully!', type: 'success' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Failed to update password', type: 'error' });
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <div className="card space-y-6">
                <header className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Lock size={20} />
                    </div>
                    <h1 className="text-xl font-bold">Change Password</h1>
                </header>

                {message.text && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {message.type === 'error' && <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            placeholder="8-16 chars, 1 Upper, 1 Special"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4">
                        <Save size={20} />
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
