import { useTranslation } from './utils/constant';
import React, { useState } from 'react';
import { User, Bell, Sliders, Shield, LogOut, Settings, Eye, Globe, Building, Sparkles } from 'lucide-react';
import {initialOrders,initialLabOrders,initialUsers,initialPatients,initialTestCatalog,initialProviders, USERS} from './utils/mockData';
import {LoginScreen } from './components/loginScreen';
import {FacilityDashboard} from './components/facilityDashboard';
import {LabDashboard} from './components/labDashboard';
import {GMDashboard} from './components/gmPortalComponent';
import {AdminPanel} from './components/adminPanelComponent';
import {NavItem } from './components/navItem';
import {NotificationsPanel} from './components/notificationsPanel';
import {NewOrderModal} from './components/newOrderModal';
import {AIAssistantModal} from './components/aiAssistantModal';
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [facilityOrders, setFacilityOrders] = useState(initialOrders);
  const [labOrders, setLabOrders] = useState(initialLabOrders);
  const [testCatalog, setTestCatalog] = useState(initialTestCatalog);
  const [providers, setProviders] = useState(initialProviders);
  const [users, setUsers] = useState(initialUsers);
  const [patients, setPatients] = useState(initialPatients);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const handleLogin = (userType) => {
      setLoggedInUser(userType);
      setNotifications([
           {id: 1, type: 'result', message: `Results for ORD-2025-00125 are ready.`, timestamp: '2025-09-18 14:30', read: false, action: () => { /* find and view order */ } },
           {id: 2, type: 'alert', message: `Order ORD-2025-00121 has an exception: Reagent unavailable.`, timestamp: '2025-09-18 11:15', read: false, action: () => { /* find and view order */ } },
           {id: 3, type: 'system', message: 'Maintenance scheduled for tonight at 2AM.', timestamp: '2025-09-18 09:00', read: true },
      ]);
  };

  const handleLogout = () => setLoggedInUser(null);
  const t = useTranslation(lang);

  const addNotification = (type, message) => {
      const newNotif = {
          id: Date.now(), type, message,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
  }

  const handleOrderSubmit = (newOrder) => {
      setFacilityOrders(prev => [newOrder, ...prev]);
      setLabOrders(prev => [{...newOrder, status: 'New Order', facility: 'Riyadh General Hospital'}, ...prev]);
      setIsNewOrderModalOpen(false);
      addNotification('new_order', `New order ${newOrder.id} submitted.`);
      if(newOrder.paymentStatus === 'Unpaid') {
          addNotification('alert', `Payment is required for order ${newOrder.id}.`);
      }
  };
  
  const markNotificationAsRead = (id) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const acknowledgeResults = (orderId) => {
      setFacilityOrders(facilityOrders.map(o => o.id === orderId ? { ...o, needsAcknowledgement: false } : o));
      addNotification('info', `Critical results for order ${orderId} have been acknowledged.`);
  };

  const updateLabOrderStatus = (orderId, newStatus, extra = {}) => {
      setLabOrders(labOrders.map(o => o.id === orderId ? {...o, ...extra, status: newStatus } : o));
      setFacilityOrders(facilityOrders.map(o => {
          if (o.id === orderId) {
              const statusMap = {'Sample to Accession': 'In Progress', 'Rejected Sample': 'Exception', 'Completed': 'Completed', 'Result to Verify': 'Results Ready'};
              const newFacilityStatus = statusMap[newStatus] || o.status;
              if(newFacilityStatus !== o.status){
                   addNotification('result', `Order ${orderId} status updated to ${newFacilityStatus}.`)
              }
              return { ...o, status: newFacilityStatus };
          }
          return o;
      }));
  };

  const toggleLang = () => {
      setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  if (!loggedInUser) return <LoginScreen onLogin={handleLogin} lang={lang} setLang={setLang} />;
  
  const currentUserInfo = USERS[loggedInUser];
  
  const UserView = () => {
      switch(loggedInUser) {
          case 'facility': return <FacilityDashboard orders={facilityOrders} onNewOrder={() => setIsNewOrderModalOpen(true)} setNotifications={setNotifications} lang={lang} onAcknowledge={acknowledgeResults} />;
          case 'lab': return <LabDashboard orders={labOrders} onUpdateStatus={updateLabOrderStatus} lang={lang} />;
          case 'gm': return <GMDashboard labOrders={labOrders} lang={lang}/>;
          case 'admin': return <AdminPanel testCatalog={testCatalog} providers={providers} users={users} onUpdateTestCatalog={setTestCatalog} onUpdateProviders={setProviders} onUpdateUsers={setUsers} lang={lang} allOrders={facilityOrders} />;
          default: return null;
      }
  };

  return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="bg-slate-900 min-h-screen text-white font-sans">
          <div className={`flex ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
               <nav className={`w-64 bg-slate-800/30 p-4 ${lang === 'ar' ? 'border-l' : 'border-r'} border-slate-700 h-screen sticky top-0 flex flex-col`}>
                  <div className="mb-8 flex items-center space-x-3 px-2"><div className="p-2 bg-indigo-500 rounded-lg"><Shield size={24}/></div><h1 className="text-xl font-bold">LabPortal</h1></div>
                  <div className="flex-1 space-y-2">{Object.keys(USERS).map(key => {
                      let icon; switch(key) { case 'facility': icon = <Building/>; break; case 'lab': icon = <Sliders/>; break; case 'gm': icon = <Eye/>; break; case 'admin': icon = <Settings/>; break; default: icon = <User/>; }
                      const roleKey = { facility: 'facilityPortal', lab: 'labOperations', gm: 'gmDashboard', admin: 'systemAdmin'}[key];
                      return <NavItem key={key} icon={icon} text={t(roleKey)} active={loggedInUser === key} onClick={() => setLoggedInUser(key)} />
                  })}</div>
                  <div className="mt-auto"><div className="p-3 border-t border-slate-700"><button onClick={handleLogout} className="w-full flex items-center space-x-3 text-slate-300 hover:text-white transition-colors"><LogOut size={20}/><span>{t('logout')}</span></button></div></div>
              </nav>
              <main className="flex-1">
                  <header className={`flex items-center p-4 border-b border-slate-700 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-sm ${lang === 'ar' ? 'flex-row-reverse space-x-reverse' : 'justify-end'}`}>
                      <div className={`flex items-center gap-6`}>
                          <button onClick={toggleLang} className="flex items-center gap-2 text-slate-400 hover:text-white"><Globe size={20}/><span>{t('lang')}</span></button>
                           <button onClick={() => setIsAiModalOpen(true)} className="flex items-center gap-2 text-slate-400 hover:text-white">
                              <Sparkles size={22} className="text-indigo-400"/> {t('aiAssistant')}
                          </button>
                          <div className="relative">
                              <button onClick={() => setShowNotifications(p => !p)} className="text-slate-400 hover:text-white">
                                  <Bell size={22} />
                                  {notifications.some(n => !n.read) && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center border-2 border-slate-900">{notifications.filter(n=>!n.read).length}</span>}
                              </button>
                              {showNotifications && <NotificationsPanel notifications={notifications} markAsRead={markNotificationAsRead} onClose={() => setShowNotifications(false)} />}
                          </div>
                          <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">{currentUserInfo.initials}</div>
                              <div><p className="font-semibold text-sm">{currentUserInfo.name}</p><p className="text-xs text-slate-400">{currentUserInfo.role}</p></div>
                          </div>
                      </div>
                  </header>
                  <UserView />
              </main>
          </div>
          {isNewOrderModalOpen && <NewOrderModal isOpen={isNewOrderModalOpen} onClose={()=>setIsNewOrderModalOpen(false)} onOrderSubmit={handleOrderSubmit} testCatalogData={testCatalog} patientsData={patients} lang={lang} />}
          {isAiModalOpen && <AIAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} allOrders={facilityOrders} t={t} />}
      </div>
  );
}