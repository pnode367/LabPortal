import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from '../utils/constant';
export const LoginScreen = ({ onLogin, lang, setLang }) => {
    const [userType, setUserType] = useState('facility');
    const t = useTranslation(lang);
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white p-4">
            <div className="text-center mb-10">
                <div className="inline-block p-4 bg-indigo-500 rounded-2xl mb-4"><Shield size={48}/></div>
                <h1 className="text-4xl font-bold">{t('loginWelcome')}</h1>
                <p className="text-slate-400 mt-2">{t('loginSubtitle')}</p>
            </div>
            <div className="w-full max-w-sm space-y-4">
                <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="facility">{t('facilityPortal')}</option>
                    <option value="lab">{t('labOperations')}</option>
                    <option value="gm">{t('gmDashboard')}</option>
                    <option value="admin">{t('systemAdmin')}</option>
                </select>
                <button onClick={()=>onLogin(userType)} className="w-full flex items-center justify-center space-x-4 p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                    <span className="text-lg font-semibold">{t('signIn')}</span>
                </button>
            </div>
             <p className="text-slate-500 mt-12 text-sm font-mono">Thursday, September 18, 2025 | 3:45 PM</p>
        </div>
    );
};