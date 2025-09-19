import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, Clock, PlusCircle } from 'lucide-react';
import { StatusBadge, StatCard } from './utilityComponent';
import { ResultViewerModal } from './ResultViewerModal';
import { useTranslation } from '../utils/constant';
export const FacilityDashboard = ({ orders, onNewOrder, setNotifications, lang, onAcknowledge }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [viewingOrder, setViewingOrder] = useState(null);
    const t = useTranslation(lang);

    const filteredOrders = orders.filter(o => statusFilter === 'All' || o.status === statusFilter).filter(o => o.patient.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10);
    
    const stats = {
        pending: orders.filter(o => ['Submitted', 'In Progress'].includes(o.status)).length,
        resultsReady: orders.filter(o => o.status === 'Results Ready').length,
        actionsRequired: orders.filter(o => o.needsAcknowledgement).length
    };
    
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('facilityDashboard')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Clock size={28} className="text-yellow-400" />} title={t('pendingOrders')} value={stats.pending} />
                <StatCard icon={<CheckCircle size={28} className="text-teal-400" />} title={t('resultsReady')} value={stats.resultsReady} />
                <StatCard icon={<AlertTriangle size={28} className="text-red-400" />} title={t('actionsRequired')} value={stats.actionsRequired} highlight={stats.actionsRequired > 0} />
                 <button onClick={onNewOrder} className="w-full h-full bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center p-6 text-lg font-semibold transform hover:scale-105">
                    <PlusCircle className="mx-2" size={24} /> {t('newJobOrder')}
                </button>
            </div>
            
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-white">{t('recentOrders')}</h2>
                    <div className="flex items-center gap-4">
                        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="All">{t('all')}</option><option value="Submitted">{t('submitted')}</option><option value="In Progress">{t('inProgress')}</option><option value="Results Ready">{t('resultsReady')}</option><option value="Completed">{t('completed')}</option><option value="Exception">{t('exception')}</option>
                        </select>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input type="text" placeholder={t('search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-3">{t('orderId')}</th><th className="p-3">{t('patient')}</th><th className="p-3">{t('date')}</th><th className="p-3">{t('status')}</th><th className="p-3 text-right">{t('actions')}</th></tr></thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-3 font-mono text-slate-300">{order.id}</td><td className="p-3 text-white">{order.patient}</td><td className="p-3 text-slate-400">{order.date}</td><td className="p-3"><StatusBadge status={order.status} /></td>
                                    <td className="p-3 text-right">{(order.status === 'Results Ready' || order.status === 'Completed' || order.status === 'Exception') && <button onClick={() => setViewingOrder(order)} className="text-indigo-400 hover:text-indigo-300 font-semibold">{t('viewDetails')}</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {viewingOrder && <ResultViewerModal order={viewingOrder} onClose={() => setViewingOrder(null)} onAcknowledge={onAcknowledge} lang={lang} />}
        </div>
    );
};