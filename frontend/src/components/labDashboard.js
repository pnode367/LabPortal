import React, { useState } from 'react';
import { useTranslation } from '../utils/constant';
import { StatusBadge } from './utilityComponent';
import {QueueCard} from './queueCard';
import {LabOrderModal} from './labOrderModal';
export const LabDashboard = ({ orders, onUpdateStatus, lang }) => {
    const [activeOrder, setActiveOrder] = useState(null);
    const t = useTranslation(lang);
    const queues = {
        newOrders: orders.filter(o => o.status === 'New Order').length,
        toAccession: orders.filter(o => o.status === 'Sample to Accession').length,
        rejected: orders.filter(o => o.status === 'Rejected Sample').length,
        toVerify: orders.filter(o => o.status === 'Result to Verify').length,
    };
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('labDashboard')}</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <QueueCard title={t('newOrders')} value={queues.newOrders} color="blue" />
                <QueueCard title={t('samplesToAccession')} value={queues.toAccession} color="yellow" />
                <QueueCard title={t('rejectedSamples')} value={queues.rejected} color="red" />
                <QueueCard title={t('resultsToVerify')} value={queues.toVerify} color="teal" />
                 <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col justify-center items-center">
                    <h3 className="text-slate-400 text-sm mb-2">{t('avgTat')}</h3>
                    <p className="text-white text-3xl font-bold">4.2 <span className="text-lg">hrs</span></p>
                </div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">{t('activeJobs')}</h2>
                <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-3">{t('orderId')}</th><th className="p-3">{t('facility')}</th><th className="p-3">{t('patient')}</th><th className="p-3">{t('status')}</th><th className="p-3 text-right">{t('actions')}</th></tr></thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="p-3 font-mono text-slate-300">{order.id}</td>
                                    <td className="p-3 text-white">{order.facility}</td>
                                    <td className="p-3 text-white">{order.patient}</td>
                                    <td className="p-3"><StatusBadge status={order.status} /></td>
                                    <td className="p-3 text-right"><button onClick={() => setActiveOrder(order)} className="text-indigo-400 hover:text-indigo-300 font-semibold">{t('manage')}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {activeOrder && <LabOrderModal order={activeOrder} onClose={() => setActiveOrder(null)} onUpdate={onUpdateStatus} t={t} />}
        </div>
    );
};