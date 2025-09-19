import React, { useState } from 'react';
import { CreditCard, MapPin, Home, Hospital, DollarSign } from 'lucide-react';
import { useTranslation } from '../utils/constant';
import { Modal} from './utilityComponent';
export const NewOrderModal = ({ isOpen, onClose, onOrderSubmit, testCatalogData, patientsData, lang }) => {
    const [step, setStep] = useState(1);
    const [patientId, setPatientId] = useState('');
    const [foundPatient, setFoundPatient] = useState(null);
    const [searchStatus, setSearchStatus] = useState('idle');
    const [selectedTests, setSelectedTests] = useState([]);
    const [newPatient, setNewPatient] = useState({ name: '', dob: '', contact: '' });
    const [collectionType, setCollectionType] = useState('At Lab');
    const [patientLocation, setPatientLocation] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Unpaid');
    const t = useTranslation(lang);

    const handlePatientSearch = () => {
        setSearchStatus('searching');
        setTimeout(() => {
            const patient = patientsData.find(p => p.nationalId === patientId);
            if (patient) { setFoundPatient(patient); setSearchStatus('found'); } else { setFoundPatient(null); setSearchStatus('not_found'); }
        }, 500);
    };

    const toggleTest = (test) => setSelectedTests(prev => prev.find(t => t.id === test.id) ? prev.filter(t => t.id !== test.id) : [...prev, test]);
    const totalCost = selectedTests.reduce((acc, test) => acc + test.price, 0);

    const submitOrder = () => {
        const patientForOrder = foundPatient || { ...newPatient, nationalId: patientId };
        const newOrder = {
            id: `ORD-2025-${Math.floor(100000 + Math.random() * 900000)}`,
            patient: patientForOrder.name, nationalId: patientForOrder.nationalId,
            tests: selectedTests.map(t => t.code), status: 'Submitted',
            date: new Date().toISOString().split('T')[0], amount: totalCost,
            results: [], needsAcknowledgement: false, paymentStatus, collectionType,
            patientLocation: collectionType === 'Home Visit' ? patientLocation : '',
        };
        onOrderSubmit(newOrder);
    };
    
    const resetWizard = () => {
        setStep(1); setPatientId(''); setFoundPatient(null); setSearchStatus('idle');
        setSelectedTests([]); setNewPatient({ name: '', dob: '', contact: '' });
        setCollectionType('At Lab'); setPatientLocation(''); setPaymentStatus('Unpaid'); onClose();
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: return (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Step 1: Find or Add Patient</h3>
                    <div className="flex gap-2 mb-4">
                        <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Enter Patient National ID" className="flex-grow bg-slate-700 p-3 rounded-lg text-white" />
                        <button onClick={handlePatientSearch} className="bg-indigo-600 px-6 rounded-lg font-semibold">Search</button>
                    </div>
                    {searchStatus === 'searching' && <p className="text-slate-400">Searching...</p>}
                    {searchStatus === 'found' && foundPatient && (<div className="bg-slate-700/50 p-4 rounded-lg"><p className="font-bold text-green-400">Patient Found</p><p className="text-white">{foundPatient.name} | DOB: {foundPatient.dob}</p></div>)}
                    {searchStatus === 'not_found' && (<div className="bg-amber-600/20 p-4 rounded-lg text-amber-300 space-y-3"><p className="font-bold">Patient not found. Please add new patient details.</p><input onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} placeholder="Full Name" className="w-full bg-slate-700 p-2 rounded-lg text-white" /><input type="date" onChange={(e) => setNewPatient({...newPatient, dob: e.target.value})} className="w-full bg-slate-700 p-2 rounded-lg text-white" /><input onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})} placeholder="Contact Number" className="w-full bg-slate-700 p-2 rounded-lg text-white" /></div>)}
                </div>
            );
            case 2: return (<div><h3 className="text-xl font-semibold mb-4 text-white">Step 2: Select Tests</h3><div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2 bg-slate-900/50 rounded-lg">{testCatalogData.map(test => (<button key={test.id} onClick={() => toggleTest(test)} className={`p-3 rounded-lg text-left transition ${selectedTests.find(t => t.id === test.id) ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}><p className="font-semibold text-white">{test.name}</p><p className="text-sm text-slate-300">SAR {test.price.toFixed(2)}</p></button>))}</div></div>);
            case 3: return (
                <div><h3 className="text-xl font-semibold mb-4 text-white">Step 3: Sample Collection</h3>
                    <div className="flex gap-4"><button onClick={() => setCollectionType('At Lab')} className={`flex-1 p-6 rounded-lg text-center transition ${collectionType === 'At Lab' ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}><Hospital className="mx-auto mb-2" />At Lab</button><button onClick={() => setCollectionType('Home Visit')} className={`flex-1 p-6 rounded-lg text-center transition ${collectionType === 'Home Visit' ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}><Home className="mx-auto mb-2" />Home Visit</button></div>
                    {collectionType === 'Home Visit' && <div className="mt-4"><label className="block text-slate-400 mb-1">Patient Location</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={patientLocation} onChange={e => setPatientLocation(e.target.value)} placeholder="Enter full address" className="w-full bg-slate-700 p-3 pl-10 rounded-lg text-white" /></div></div>}
                </div>
            );
            case 4: return (
                <div><h3 className="text-xl font-semibold mb-4 text-white">Step 4: Payment</h3>
                    <div className="bg-slate-900/50 p-4 rounded-lg mb-4"><p className="font-bold text-xl text-white">Total: SAR {totalCost.toFixed(2)}</p></div>
                    <div className="flex gap-4"><button onClick={() => setPaymentStatus('Paid')} className={`flex-1 p-6 rounded-lg text-center transition ${paymentStatus === 'Paid' ? 'bg-green-600 ring-2 ring-green-400' : 'bg-slate-700 hover:bg-slate-600'}`}><CreditCard className="mx-auto mb-2" />Pay Now</button><button onClick={() => setPaymentStatus('Unpaid')} className={`flex-1 p-6 rounded-lg text-center transition ${paymentStatus === 'Unpaid' ? 'bg-amber-600 ring-2 ring-amber-400' : 'bg-slate-700 hover:bg-slate-600'}`}><DollarSign className="mx-auto mb-2" />Pay Later / Insurance</button></div>
                </div>
            );
            case 5: return (
                <div><h3 className="text-xl font-semibold mb-4 text-white">Step 5: Review and Submit</h3>
                    <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
                        <div><p className="font-semibold text-slate-400">Patient:</p><p className="text-white">{foundPatient?.name || newPatient.name} ({patientId})</p></div>
                        <div><p className="font-semibold text-slate-400">Selected Tests:</p><ul className="list-disc list-inside text-slate-300">{selectedTests.map(t => <li key={t.id}>{t.name}</li>)}</ul></div>
                        <div><p className="font-semibold text-slate-400">Collection:</p><p className="text-white">{collectionType} {collectionType === 'Home Visit' && `at ${patientLocation}`}</p></div>
                        <div><p className="font-semibold text-slate-400">Payment:</p><p className="text-white">{paymentStatus}</p></div>
                        <p className="font-bold text-2xl text-white pt-3 border-t border-slate-700">Total: SAR {totalCost.toFixed(2)}</p>
                    </div>
                </div>
            );
            default: return null;
        }
    };
    
    const canProceed = () => {
        if (step === 1) return searchStatus === 'found' || (searchStatus === 'not_found' && newPatient.name && newPatient.dob);
        if (step === 2) return selectedTests.length > 0;
        if (step === 3) return collectionType === 'At Lab' || (collectionType === 'Home Visit' && patientLocation !== '');
        return true;
    };

    return (
        <Modal isOpen={isOpen} onClose={resetWizard} size="4xl">
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-2 text-white">New Job Order Wizard</h2>
                <div className="w-full bg-slate-700 rounded-full h-1.5 mb-6"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(step / 5) * 100}%` }}></div></div>
                {renderStepContent()}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-700">
                    <button onClick={() => setStep(s => s - 1)} disabled={step === 1} className="px-6 py-2 bg-slate-700 rounded-lg disabled:opacity-50">Back</button>
                    {step < 5 ? (<button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="px-6 py-2 bg-indigo-600 rounded-lg disabled:opacity-50">Next</button>) : (<button onClick={submitOrder} className="px-6 py-2 bg-green-600 rounded-lg">Submit Order</button>)}
                </div>
            </div>
        </Modal>
    );
};