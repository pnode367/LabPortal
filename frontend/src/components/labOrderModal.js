import { Modal,StatusBadge } from './utilityComponent';
export const LabOrderModal = ({ order, onClose, onUpdate, t }) => {
    const nextStatusOptions = {
        'New Order': 'Sample to Accession',
        'Sample to Accession': 'Result to Verify', // Simplified flow
        'Result to Verify': 'Completed'
    };
    const nextStatus = nextStatusOptions[order.status];

    const handleUpdate = () => {
        if (nextStatus) {
            onUpdate(order.id, nextStatus);
        }
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="3xl">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-white">{t('manageOrder')}: {order.id}</h2>
                <div className="mt-4 bg-slate-900/50 p-4 rounded-lg space-y-2">
                    <p><span className="font-semibold text-slate-400">Patient:</span> {order.patient}</p>
                    <p><span className="font-semibold text-slate-400">Facility:</span> {order.facility}</p>
                    <p><span className="font-semibold text-slate-400">Current Status:</span> <StatusBadge status={order.status}/></p>
                    {order.reason && <p><span className="font-semibold text-red-400">Rejection Reason:</span> {order.reason}</p>}
                </div>
                 <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-700 rounded-lg">Close</button>
                    {nextStatus && <button onClick={handleUpdate} className="px-6 py-2 bg-indigo-600 rounded-lg">Move to: {nextStatus}</button>}
                </div>
            </div>
        </Modal>
    );
};
