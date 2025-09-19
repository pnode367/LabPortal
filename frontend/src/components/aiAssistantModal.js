import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Modal} from './utilityComponent';
export const AIAssistantModal = ({ isOpen, onClose, allOrders, t }) => {
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am Lara, your AI assistant. How can I help you with the lab data today?' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = async (query) => {
        const currentQuery = query || input;
        if (!currentQuery.trim() || isLoading) return;
        
        const userMessage = { sender: 'user', text: currentQuery };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const systemPrompt = `You are an AI assistant for LabPortal, a laboratory information system. Your name is 'Lara'. You have access to a list of recent orders in JSON format. Your primary job is to answer questions based *only* on this data. Be concise and helpful. Today's date is September 18, 2025. Do not make up information. If the data to answer a question is not present, say that you cannot answer. Do not mention the JSON data format to the user. Just use the data to answer questions.`;
        const contextData = allOrders.map(o => ({ id: o.id, patient: o.patient, status: o.status, date: o.date, amount: o.amount, paymentStatus: o.paymentStatus, critical: o.needsAcknowledgement }));
        const userQuery = `Here is the current list of orders: ${JSON.stringify(contextData)}\n\nMy question is: ${currentQuery}`;
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            setMessages(prev => [...prev, { sender: 'ai', text: text || "Sorry, I can't respond right now." }]);
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "There was an error connecting to the AI assistant. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <div className="flex flex-col h-[70vh]">
                <div className="p-4 border-b border-slate-700 flex items-center gap-3"><Sparkles className="text-indigo-400" /> <h2 className="text-xl font-bold text-white">{t('aiAssistant')}</h2></div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center"><Sparkles size={16}/></div>}
                            <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>{msg.text}</div>
                        </div>
                    ))}
                    {isLoading && <div className="flex items-end gap-2"><div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center"><Sparkles size={16}/></div><div className="max-w-lg p-3 rounded-2xl bg-slate-700 rounded-bl-none"><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div></div></div></div>}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-slate-700">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">{t('suggestedQueries')}</h4>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleSend(t('queryCriticalResults'))} className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm">{t('queryCriticalResults')}</button>
                        <button onClick={() => handleSend(t('queryTodaysRevenue'))} className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm">{t('queryTodaysRevenue')}</button>
                        <button onClick={() => handleSend(t('queryPendingOrders'))} className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm">{t('queryPendingOrders')}</button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder={t('askAnything')} disabled={isLoading} className="flex-1 bg-slate-700 p-3 rounded-lg text-white disabled:opacity-50" />
                        <button onClick={() => handleSend()} disabled={isLoading} className="bg-indigo-600 px-6 rounded-lg font-semibold flex items-center justify-center disabled:opacity-50"><Send size={18}/></button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};