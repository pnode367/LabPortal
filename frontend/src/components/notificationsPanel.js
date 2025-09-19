import React, {  } from 'react';
import { User, Bell, X, CheckCircle, AlertTriangle, PlusCircle, Settings } from 'lucide-react';

export const NotificationsPanel = ({ notifications, markAsRead, onClose }) => {
    const icons = { result: <CheckCircle className="text-teal-400"/>, alert: <AlertTriangle className="text-red-400"/>, system: <Settings className="text-slate-400"/>, new_order: <PlusCircle className="text-blue-400"/>, info: <User className="text-indigo-400"/> };
    return (
        <div className="absolute top-full right-0 mt-2 w-96 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-30 animate-fade-in-down">
            <div className="p-3 border-b border-slate-700 flex justify-between items-center"><h3 className="font-semibold">Notifications</h3><button onClick={onClose}><X size={18}/></button></div>
            <div className="p-2 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map(n=>(<div key={n.id} onClick={()=>markAsRead(n.id)} className={`flex items-start gap-3 p-3 rounded-md hover:bg-slate-700 cursor-pointer ${!n.read ? 'text-white' : 'text-slate-400'}`}>
                    <div className="mt-1">{icons[n.type] || <Bell />}</div>
                    <div><p className="text-sm">{n.message}</p><p className="text-xs text-slate-500 mt-1">{n.timestamp}</p></div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-400 self-center ml-auto"></div>}
                </div>)) : <div className="p-4 text-center text-slate-400 text-sm">No new notifications</div>}
            </div>
        </div>
    );
};