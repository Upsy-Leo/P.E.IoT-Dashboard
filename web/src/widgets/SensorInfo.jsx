import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Activity, CheckCircle2, User, Clock, X, Hash } from 'lucide-react';

const SensorInfo = ({ data, onClose, className = "" }) => {
    useEffect(() => {
        if (data) console.log("SensorInfo Data Received:", data);
    }, [data]);

    const [isResolving, setIsResolving] = useState(false);

    // Normalisation des données
    const isAlert = data && data.status === 'unresolved';

    // On extrait le pays (User.location) et la pièce (Sensor.location)
    const country = data?.measureID?.sensorID?.userID?.location
        || data?.sensorID?.userID?.location
        || 'Global';

    const room = data?.location // Snapshot dans l'alerte
        || data?.sensorID?.location // En direct du capteur
        || 'Unknown Area';

    const type = data?.type || data?.measureID?.type || 'Unknown';
    const value = data?.value || '--';
    const timestamp = data?.createdAt || data?.creationDate || new Date();
    const u = data?.measureID?.sensorID?.userID || data?.sensorID?.userID;
    const userIdDisplay = u?._id ? `#${u._id.toString().slice(-4).toUpperCase()}` : 'N/A';
    const tenants = u?.personsInHouse || 0;
    const houseSize = u?.houseSize || 'N/A';
    const refId = data?._id ? data._id.toString().slice(-4).toUpperCase() : 'N/A';

    const handleResolve = async () => {
        if (!data || !isAlert) return;
        setIsResolving(true);
        try {
            await axios.post(`http://localhost:3000/api/alerts/${data._id}/resolve`);
            onClose();
        } catch (err) {
            console.error("Erreur:", err);
            alert("Erreur réseau");
        } finally {
            setIsResolving(false);
        }
    };

    if (!data) {
        return (
            <div className={`glass-card p-4 rounded-3xl flex flex-col items-center justify-center text-center opacity-30 ${className}`}>
                <Shield className="text-gray-700 mb-2" size={20} />
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Waiting for selection</p>
            </div>
        );
    }

    return (
        <div className={`glass-card widget-transition p-4 rounded-3xl flex flex-col ${className} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-black">
                        {isAlert ? 'Anomaly Alert' : 'Data Selection'}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg neumorphic-button transition-all"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Title */}
            <div className="mb-4">
                <h3 className="text-xl font-black text-white leading-tight">{country}</h3>
                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter mt-1">
                    Sensor: {type} — <span className="text-accent-green">{room}</span>
                </p>
            </div>

            {/* 3 Boxes Layout */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                {/* Case 1: Valeur */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                    <Activity className={`${isAlert ? 'text-accent-green' : 'text-blue-400'} mb-1`} size={14} />
                    <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">Value</p>
                    <p className="text-xs font-black text-white">{value}</p>
                </div>

                {/* Case 2: Identifiants */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                    <User className="text-gray-500 mb-1" size={14} />
                    <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">REF / PROPERTY</p>
                    <p className="text-[9px] font-mono text-gray-300">{userIdDisplay}</p>
                    <p className="text-[8px] font-bold text-gray-400 mt-0.5 truncate w-full uppercase">
                        {tenants} pers. / {houseSize}
                    </p>
                </div>

                {/* Case 3: Date et Heure */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                    <Clock className="text-gray-500 mb-1" size={14} />
                    <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">Timestamp</p>
                    <p className="text-[9px] text-gray-300 font-mono">
                        {new Date(timestamp).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                    </p>
                    <p className="text-[9px] text-gray-300 font-mono">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2">
                {isAlert ? (
                    <button
                        onClick={handleResolve}
                        disabled={isResolving}
                        className="flex-[2] neumorphic-button accent py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-[9px] uppercase font-black"
                    >
                        <CheckCircle2 size={12} />
                        Resolve Incident
                    </button>
                ) : (
                    <div className="flex-[2] bg-white/5 border border-white/5 text-gray-500 font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-[9px] uppercase">
                        Monitoring Only
                    </div>
                )}
                <button className="flex-1 neumorphic-button py-2 rounded-xl text-[8px] uppercase tracking-widest font-bold">
                    Tools
                </button>
                <button className="flex-1 neumorphic-button py-2 rounded-xl text-[8px] uppercase tracking-widest font-bold">
                    Report
                </button>
            </div>
        </div>
    );
};

export default SensorInfo;
