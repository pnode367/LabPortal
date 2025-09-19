import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { PlusCircle, FileText, Users, HardDrive, CreditCard, BarChart2, Edit, Trash2, UserPlus } from 'lucide-react';
import { StatusBadge, Modal } from './utilityComponent';
import { useTranslation } from '../utils/constant';
import { auditLogs } from '../utils/mockData';
import {KPI_Card } from './gmPortalComponent';
export const UserManagement = ({ users, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleSave = (userData) => {
        let updatedUsers;
        if (editingUser) {
            updatedUsers = users.map(u => u.id === userData.id ? userData : u);
        } else {
            updatedUsers = [...users, { ...userData, id: `U${Date.now()}` }];
        }
        onUpdate(updatedUsers);
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (userId) => {
        onUpdate(users.filter(u => u.id !== userId));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">User Management</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    <UserPlus size={18} className="mr-2"/> Add New User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Facility/Dept</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-3 text-white">{user.name}</td>
                                <td className="p-3 text-slate-300">{user.email}</td>
                                <td className="p-3 text-slate-300">{user.role}</td>
                                <td className="p-3 text-slate-300">{user.facility}</td>
                                <td className="p-3"><StatusBadge status={user.status} /></td>
                                <td className="p-3 text-right space-x-4">
                                    <button onClick={() => handleOpenModal(user)} className="text-indigo-400 hover:text-indigo-300"><Edit size={16}/></button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <UserModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export const UserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState(user || { name: '', email: '', role: 'Facility User', facility: '', status: 'Active' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="3xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{user ? 'Edit User' : 'Add New User'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full bg-slate-700 p-3 rounded-lg text-white" required />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-slate-700 p-3 rounded-lg text-white" required />
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg text-white">
                        <option>Facility User</option>
                        <option>Lab Business User</option>
                        <option>Lab GM</option>
                        <option>System Admin</option>
                    </select>
                    <input name="facility" value={formData.facility} onChange={handleChange} placeholder="Facility/Department" className="w-full bg-slate-700 p-3 rounded-lg text-white" required />
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 p-3 rounded-lg text-white">
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-lg">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export const ProviderManagement = ({ providers, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState(null);

    const handleSave = (providerData) => {
        let updatedProviders;
        if (editingProvider) {
            updatedProviders = providers.map(p => p.id === providerData.id ? providerData : p);
        } else {
            updatedProviders = [...providers, { ...providerData, id: `P${Date.now()}` }];
        }
        onUpdate(updatedProviders);
        setIsModalOpen(false);
        setEditingProvider(null);
    };
    
    const handleOpenModal = (provider = null) => {
        setEditingProvider(provider);
        setIsModalOpen(true);
    };

    const handleDelete = (providerId) => {
        onUpdate(providers.filter(p => p.id !== providerId));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Providers & Pricing</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    <PlusCircle size={18} className="mr-2"/> Add New Provider
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Pricing Agreement</th><th className="p-3 text-right">Actions</th></tr></thead>
                    <tbody>
                        {providers.map(provider => (
                            <tr key={provider.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-3 font-mono text-slate-300">{provider.id}</td>
                                <td className="p-3 text-white">{provider.name}</td>
                                <td className="p-3 text-slate-300">{provider.agreement}</td>
                                <td className="p-3 text-right space-x-4">
                                    <button onClick={() => handleOpenModal(provider)} className="text-indigo-400 hover:text-indigo-300"><Edit size={16}/></button>
                                    <button onClick={() => handleDelete(provider.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ProviderModal provider={editingProvider} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export const ProviderModal = ({ provider, onClose, onSave }) => {
    const [formData, setFormData] = useState(provider || { name: '', agreement: 'Standard Price List' });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="2xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{provider ? 'Edit Provider' : 'Add New Provider'}</h2>
                <div className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Provider Name" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" required />
                    <select name="agreement" value={formData.agreement} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white">
                        <option>Standard Price List</option>
                        <option>10% Discount</option>
                        <option>15% Discount</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-lg">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export const AdminPanel = ({ testCatalog, providers, users, onUpdateTestCatalog, onUpdateProviders, onUpdateUsers, lang, allOrders }) => {
    const [activeTab, setActiveTab] = useState('users');
    const t = useTranslation(lang);
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">{t('adminPanel')}</h1>
            <div className="flex space-x-2 border-b border-slate-700 mb-6 flex-wrap">
                <AdminTabButton id="users" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Users />}>{t('userManagement')}</AdminTabButton>
                <AdminTabButton id="catalog" activeTab={activeTab} setActiveTab={setActiveTab} icon={<FileText />}>{t('testCatalog')}</AdminTabButton>
                <AdminTabButton id="providers" activeTab={activeTab} setActiveTab={setActiveTab} icon={<CreditCard />}>{t('providersPricing')}</AdminTabButton>
                <AdminTabButton id="reports" activeTab={activeTab} setActiveTab={setActiveTab} icon={<BarChart2 />}>Advanced Reports</AdminTabButton>
                <AdminTabButton id="system" activeTab={activeTab} setActiveTab={setActiveTab} icon={<HardDrive />}>{t('systemHealth')}</AdminTabButton>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 min-h-[60vh]">
                {activeTab === 'users' && <UserManagement users={users} onUpdate={onUpdateUsers} />}
                {activeTab === 'catalog' && <TestCatalogManagement testCatalog={testCatalog} onUpdate={onUpdateTestCatalog} t={t} />}
                {activeTab === 'providers' && <ProviderManagement providers={providers} onUpdate={onUpdateProviders} />}
                {activeTab === 'reports' && <AdminReports allOrders={allOrders} testCatalog={testCatalog} auditLogs={auditLogs} />}
                {activeTab === 'system' && <SystemHealth />}
            </div>
        </div>
    );
};

export const AdminReports = ({ allOrders, testCatalog, auditLogs }) => {
    const financialSummary = {
        totalRevenue: allOrders.reduce((sum, order) => sum + (order.paymentStatus === 'Paid' ? order.amount : 0), 0),
        outstanding: allOrders.reduce((sum, order) => sum + (order.paymentStatus === 'Unpaid' ? order.amount : 0), 0),
        totalOrders: allOrders.length,
    };

    const testFrequency = testCatalog.map(test => {
        const count = allOrders.filter(order => order.tests.includes(test.code)).length;
        return { name: test.code, count };
    }).sort((a, b) => b.count - a.count);

    const testFrequencyData = {
        labels: testFrequency.map(t => t.name),
        datasets: [{
            label: 'Times Ordered',
            data: testFrequency.map(t => t.count),
            backgroundColor: '#818cf8',
        }]
    };
     const chartOptions = { plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } } } };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white">Advanced Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KPI_Card title="Total Revenue" value={`SAR ${financialSummary.totalRevenue.toFixed(2)}`} />
                <KPI_Card title="Outstanding Payments" value={`SAR ${financialSummary.outstanding.toFixed(2)}`} />
                <KPI_Card title="Total Orders Processed" value={financialSummary.totalOrders} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Test Frequency Analysis</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg"><Bar data={testFrequencyData} options={chartOptions}/></div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">User Activity Logs</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                     <table className="w-full text-left text-sm">
                        <thead className="text-slate-400 border-b border-slate-700 sticky top-0 bg-slate-900"><tr><th className="p-2">Timestamp</th><th className="p-2">User</th><th className="p-2">Action</th></tr></thead>
                        <tbody>{auditLogs.map((log, i) => (<tr key={i} className="border-b border-slate-800"><td className="p-2 font-mono text-slate-300">{log.timestamp}</td><td className="p-2">{log.user}</td><td className="p-2 text-slate-400">{log.action}</td></tr>))}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export const AdminTabButton = ({ id, activeTab, setActiveTab, icon, children }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition ${activeTab === id ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:bg-slate-700/50'}`}>{icon}<span>{children}</span></button>
);


export const TestCatalogManagement = ({ testCatalog, onUpdate, t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState(null);

    const handleSave = (testData) => {
        let updatedCatalog;
        if (editingTest) {
            updatedCatalog = testCatalog.map(t => t.id === testData.id ? testData : t);
        } else {
            updatedCatalog = [...testCatalog, { ...testData, id: `T${Date.now()}` }];
        }
        onUpdate(updatedCatalog);
        setIsModalOpen(false);
        setEditingTest(null);
    };
    
    const handleOpenModal = (test = null) => {
        setEditingTest(test);
        setIsModalOpen(true);
    };

    const handleDelete = (testId) => {
        onUpdate(testCatalog.filter(t => t.id !== testId));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">{t('testCatalog')}</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    <PlusCircle size={18} className="mr-2"/> {t('addNewTest')}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-3">Name</th><th className="p-3">Code</th><th className="p-3">Price (SAR)</th><th className="p-3">Specimen</th><th className="p-3">TAT</th><th className="p-3 text-right">Actions</th></tr></thead>
                    <tbody>
                        {testCatalog.map(test => (
                            <tr key={test.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="p-3 text-white">{test.name}</td>
                                <td className="p-3 text-slate-300">{test.code}</td>
                                <td className="p-3 text-slate-300">{test.price.toFixed(2)}</td>
                                <td className="p-3 text-slate-300">{test.specimen}</td>
                                <td className="p-3 text-slate-300">{test.tat}</td>
                                <td className="p-3 text-right space-x-4">
                                    <button onClick={() => handleOpenModal(test)} className="text-indigo-400 hover:text-indigo-300"><Edit size={16}/></button>
                                    <button onClick={() => handleDelete(test.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <TestCatalogModal test={editingTest} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export const TestCatalogModal = ({ test, onClose, onSave }) => {
    const [formData, setFormData] = useState(test || { name: '', code: '', price: '', specimen: '', tat: '' });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'price' ? parseFloat(value) : value });
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <Modal isOpen={true} onClose={onClose} size="3xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">{test ? 'Edit Test' : 'Add New Test'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Test Name" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" required />
                    <input name="code" value={formData.code} onChange={handleChange} placeholder="Test Code" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" required />
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price (SAR)" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" required />
                    <input name="specimen" value={formData.specimen} onChange={handleChange} placeholder="Specimen Type" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" required />
                    <input name="tat" value={formData.tat} onChange={handleChange} placeholder="Turnaround Time (e.g., 4 hours)" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white" required />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-700 rounded-lg">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-lg">Save</button>
                </div>
            </form>
        </Modal>
    );
};


export const SystemHealth = () => {
    const healthStatus = { "API Services": "Operational", "Database Connection": "Operational", "LIS Integration": "Degraded Performance" };
    return (<div><h2 className="text-xl font-semibold text-white mb-4">System Health Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">{Object.entries(healthStatus).map(([service, status]) => (<div key={service} className="bg-slate-700 p-4 rounded-lg"><div className="flex justify-between items-center"><span className="text-white">{service}</span><span className={`px-2 py-1 text-xs rounded-full ${status === 'Operational' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>{status}</span></div></div>))}</div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Audit Logs</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-3">Timestamp</th><th className="p-3">User</th><th className="p-3">Action</th></tr></thead>
            <tbody>{auditLogs.map((log, i) => (<tr key={i} className="border-b border-slate-700 hover:bg-slate-700/50"><td className="p-3 font-mono text-slate-300">{log.timestamp}</td><td className="p-3 text-white">{log.user}</td><td className="p-3 text-slate-300">{log.action}</td></tr>))}</tbody>
        </table></div></div>
    );
};