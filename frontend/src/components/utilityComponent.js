import { X } from 'lucide-react';

export const Modal = ({ children, isOpen, onClose, size = '3xl' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className={`bg-slate-800 rounded-2xl shadow-2xl w-full max-w-${size} relative transform transition-all duration-300 animate-slide-up`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"><X size={24} /></button>
                {children}
            </div>
        </div>
    );
};

export const StatusBadge = ({ status }) => {
    const statusClasses = { 'Submitted': 'bg-blue-500/20 text-blue-300', 'New Order': 'bg-blue-500/20 text-blue-300', 'In Progress': 'bg-yellow-500/20 text-yellow-300', 'Sample to Accession': 'bg-yellow-500/20 text-yellow-300', 'Results Ready': 'bg-teal-500/20 text-teal-300', 'Completed': 'bg-green-500/20 text-green-300', 'Result to Verify': 'bg-teal-500/20 text-teal-300', 'Exception': 'bg-amber-500/20 text-amber-300', 'Critical': 'bg-red-600/20 text-red-400', 'Rejected Sample': 'bg-red-600/20 text-red-400', 'Active': 'bg-green-500/20 text-green-300', 'Inactive': 'bg-slate-500/20 text-slate-400'};
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-slate-500/20 text-slate-300'}`}>{status}</span>;
};

export const StatCard = ({ icon, title, value, highlight = false }) => (
    <div className={`bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 flex items-center space-x-4 ${highlight ? 'border-red-500 ring-2 ring-red-500/50' : ''}`}>
        <div className="bg-slate-700 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-white text-3xl font-bold">{value}</p>
        </div>
    </div>
);
