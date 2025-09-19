export const NavItem = ({ icon, text, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>{icon}<span>{text}</span></button>
);