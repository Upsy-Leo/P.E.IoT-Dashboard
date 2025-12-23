import { useState } from 'react';
import axios from 'axios';
import { Shield, Activity, CheckCircle2, User, Clock, X, Hash } from 'lucide-react';

const SensorInfo = ({ alert, onClose, className = "" }) => {
    const [isResolving, setIsResolving] = useState(false);

    const handleResolve = async () => {
        if (!alert) return;
        setIsResolving(true);
        try {
            await axios.post(`http://localhost:3000/api/alerts/${alert._id}/resolve`);
            onClose();
        } catch (err) {
            console.error("Erreur:", err);
            alert("Erreur réseau");
        } finally {
            setIsResolving(false);
        }
    };

    if (!alert) {
        return (
            <div className={`bg-card-bg rounded-3xl p-4 border border-gray-800/40 shadow-xl flex flex-col items-center justify-center text-center opacity-30 ${className}`}>
                <Shield className="text-gray-700 mb-2" size={20} />
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Waiting for selection</p>
            </div>
        );
    }

    return (
        <div className={`bg-card-bg rounded-3xl p-4 border border-gray-800/40 shadow-xl flex flex-col ${className} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-black">Anomaly Alert</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Location Title */}
            <div className="mb-4">
                <h3 className="text-xl font-black text-white leading-tight">{alert.location}</h3>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-1">Sensor type: {alert.type}</p>
            </div>

            {/* 3 Boxes Layout */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                {/* Case 1: Valeur */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                    <Activity className="text-accent-green mb-1" size={14} />
                    <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">Value</p>
                    <p className="text-xs font-black text-white">{alert.value}</p>
                </div>

                {/* Case 2: Identifiants */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                    <Hash className="text-gray-500 mb-1" size={14} />
                    <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">REF / USER</p>
                    <p className="text-[9px] font-mono text-gray-300">#{alert._id.slice(-4).toUpperCase()}</p>
                    <p className="text-[8px] font-bold text-gray-400 mt-0.5 truncate w-full uppercase">
                        {alert.measureID?.sensorID?.userID?.username || 'SYSTEM'}
                    </p>
                </div>

                {/* Case 3: Date et Heure */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                    <Clock className="text-gray-500 mb-1" size={14} />
                    <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">Timestamp</p>
                    <p className="text-[9px] text-gray-300 font-mono">
                        {new Date(alert.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                    </p>
                    <p className="text-[9px] text-gray-300 font-mono">
                        {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2">
                <button
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="flex-[2] bg-accent-green hover:bg-green-400 text-black font-black py-2.5 rounded-xl transition-all shadow-lg active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-1.5 text-[9px] uppercase"
                >
                    <CheckCircle2 size={12} />
                    Resolve Incident
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-2 rounded-xl text-[8px] uppercase tracking-widest border border-white/5 transition-colors">
                    Tools
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-2 rounded-xl text-[8px] uppercase tracking-widest border border-white/5 transition-colors">
                    Report
                </button>
            </div>
        </div>
    );
};

export default SensorInfo;
