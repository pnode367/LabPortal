import React, { useState, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { BarChart2, Printer } from 'lucide-react';
import { useTranslation } from '../utils/constant';
import {AdminTabButton} from './adminPanelComponent';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title as ChartTitle } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ChartTitle);

export const GMDashboard = ({ labOrders, lang }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const t = useTranslation(lang);

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('gmDashboardTitle')}</h1>
             <div className="flex space-x-2 border-b border-slate-700 mb-6 flex-wrap">
                <AdminTabButton id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BarChart2 />}>Dashboard</AdminTabButton>
                <AdminTabButton id="reports" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Printer />}>{t('reports')}</AdminTabButton>
            </div>
            {activeTab === 'dashboard' && <GMAnalytics t={t} />}
            {activeTab === 'reports' && <ReportsSection t={t} />}
        </div>
    );
};

export const GMAnalytics = ({t}) => {
    const chartOptions = { plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };
    const revenueData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], datasets: [{ label: 'Revenue (SAR)', data: [65000, 59000, 80000, 81000, 56000, 55000, 90000], fill: false, borderColor: '#34d399', tension: 0.1 }] };
    const orderVolumeData = { labels: ['Riyadh General', 'Future Medical', 'Hope Clinic', 'Wellness Center'], datasets: [{ label: 'Orders', data: [120, 95, 60, 45], backgroundColor: '#60a5fa', }] };
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KPI_Card title={t('totalRevenue')} value="SAR 286,000" change="+5.2%" />
                <KPI_Card title={t('avgTat')} value="4.2 Hours" change="-0.3hr" positive={false} />
                <KPI_Card title={t('rejectionRate')} value="2.1%" change="+0.2%" positive={false}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700"><h2 className="text-xl font-semibold text-white mb-4">{t('revenueTrends')}</h2><Line data={revenueData} options={chartOptions}/></div>
                <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700"><h2 className="text-xl font-semibold text-white mb-4">{t('orderVolumeProvider')}</h2><Bar data={orderVolumeData} options={chartOptions}/></div>
            </div>
        </>
    )
}

export const ReportsSection = ({t}) => {
    const reportRef = useRef();

    const handlePrint = () => {
        const printContents = reportRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `<div class="print-container">${printContents}</div>`;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // to re-attach react components
    };

    return(
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Monthly Revenue Report - September 2025</h2>
                 <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    <Printer size={18} /> Print Report
                </button>
             </div>
             <div ref={reportRef}>
                <style type="text/css" media="print">
                    {`
                        @page { size: auto; margin: 20mm; }
                        body { background-color: #fff; color: #000; }
                        .print-container { font-family: sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h1, h2, h3 { color: #000; }
                    `}
                </style>
                <div className="bg-slate-900 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Summary</h3>
                    <p>Total Revenue: SAR 98,450.00</p>
                    <p>Total Orders: 250</p>
                    <h3 className="text-lg font-bold mt-4 mb-2">Revenue by Provider</h3>
                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-700"><tr><th className="p-2">Provider</th><th className="p-2">Orders</th><th className="p-2">Revenue</th></tr></thead>
                        <tbody>
                             <tr className="border-b border-slate-800"><td>Riyadh General Hospital</td><td>120</td><td>SAR 45,200.00</td></tr>
                             <tr className="border-b border-slate-800"><td>Future Medical Center</td><td>95</td><td>SAR 38,100.00</td></tr>
                             <tr className="border-b border-slate-800"><td>Hope Clinic</td><td>35</td><td>SAR 15,150.00</td></tr>
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    )
}

export const KPI_Card = ({title, value, change, positive=true}) => (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-white text-3xl font-bold my-2">{value}</p>
        <p className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
    </div>
);