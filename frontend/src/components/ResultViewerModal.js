import React, { useState } from 'react';
import { AlertTriangle, Download, Sparkles } from 'lucide-react';
import { useTranslation } from '../utils/constant';
import { Modal,StatusBadge } from './utilityComponent';
export const ResultViewerModal = ({ order, onClose, onAcknowledge, lang }) => {
    const t = useTranslation(lang);
    const [explanation, setExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    const handleAcknowledge = () => {
        onAcknowledge(order.id);
        onClose();
    };

    const handleExplainResults = async () => {
        if (isExplaining) return;
        setIsExplaining(true);
        setExplanation('');

        const systemPrompt = `You are a helpful medical assistant. Explain the following lab test results in simple, easy-to-understand language for a non-medical person. Focus on what the test measures and what an out-of-range value might indicate in general terms. CRITICALLY IMPORTANT: You MUST end your explanation with the exact sentence: "Disclaimer: This is for informational purposes only and is not medical advice. Consult a healthcare professional."`;
        const userQuery = `Please explain these results:\n${order.results.map(r => `- ${r.name}: ${r.value} (Normal range: ${r.range}) ${r.isCritical ? '[CRITICAL]' : ''}`).join('\n')}`;
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            setExplanation(text || "Sorry, I couldn't generate an explanation for these results.");
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setExplanation("An error occurred while generating the explanation. Please try again later.");
        } finally {
            setIsExplaining(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="4xl">
            <div className="p-8">
                 <h2 className="text-2xl font-bold text-white mb-2">{t('testResults')}</h2>
                 <p className="text-slate-400">{t('orderId')}: {order.id} | {t('patient')}: {order.patient}</p>
                 <div className="mt-6 bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    {order.status === 'Exception' ? (
                        <div className="text-amber-300 text-center p-4"><AlertTriangle className="mx-auto mb-2" /> Note: {order.note}</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-400 border-b border-slate-700"><tr><th className="p-2">Test Name</th><th className="p-2">Result</th><th className="p-2">Reference Range</th><th className="p-2">Status</th></tr></thead>
                            <tbody>
                                {order.results?.map((res, i) => (
                                    <tr key={i} className={`border-b border-slate-800 ${res.isCritical ? 'bg-red-500/10' : ''}`}>
                                        <td className="p-3 text-white font-semibold">{res.name}</td>
                                        <td className={`p-3 font-bold ${res.isCritical ? 'text-red-400' : 'text-white'}`}>{res.value}</td>
                                        <td className="p-3 text-slate-400">{res.range}</td>
                                        <td className="p-3">{res.isCritical && <StatusBadge status="Critical" />}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                 </div>
                 {(isExplaining || explanation) && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Sparkles size={18} className="text-indigo-400" /> {t('aiExplanation')}</h3>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 min-h-[5rem]">
                            {isExplaining ? (
                                <p className="text-slate-400 animate-pulse">Generating explanation...</p>
                            ) : (
                                <p className="text-slate-300 whitespace-pre-wrap">{explanation}</p>
                            )}
                        </div>
                    </div>
                )}
                 <div className="flex justify-end gap-4 mt-8">
                    {order.results && <button onClick={handleExplainResults} disabled={isExplaining} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <Sparkles size={18}/>{isExplaining ? t('generatingExplanation') : t('explainResultsAI')}</button>}
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"><Download size={18}/>{t('downloadPdf')}</button>
                    {order.needsAcknowledgement && <button onClick={handleAcknowledge} className="flex items-center gap-2 px-4 py-2 bg-amber-600 rounded-lg hover:bg-amber-700 font-semibold"><AlertTriangle size={18}/>{t('acknowledge')}</button>}
                 </div>
            </div>
        </Modal>
    );
};