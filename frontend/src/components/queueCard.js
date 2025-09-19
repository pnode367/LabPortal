export const QueueCard = ({ title, value, color }) => {
    const colorClasses = { blue: 'border-blue-500', yellow: 'border-yellow-500', red: 'border-red-500', teal: 'border-teal-500' };
    return (<div className={`bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 ${colorClasses[color]}`}><p className="text-slate-400">{title}</p>
    <p className="text-white text-4xl font-bold mt-2">{value}</p></div>);
};
