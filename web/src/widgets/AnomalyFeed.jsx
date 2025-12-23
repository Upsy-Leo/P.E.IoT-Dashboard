import { useEffect, useState } from 'react';
import axios from 'axios';

const AnomalyFeed = ({ filter, onAlertSelect, selectedAlertId }) => {
    const [alerts, setAlerts] = useState([]);
    const [activeType, setActiveType] = useState('all');

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const scope = filter?.scope || 'worldwide';
                const value = filter?.value || '';

                let url = `http://localhost:3000/api/alerts`;

                if (scope === 'country' && value) {
                    url += `?location=${value}`;
                }

                const res = await axios.get(url);
                setAlerts(res.data);
            } catch (err) {
                console.error("Erreur alertes:", err);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 15000);
        return () => clearInterval(interval);
    }, [filter]);

    const filteredAlerts = activeType === 'all'
        ? alerts
        : alerts.filter(a => a.type === activeType);

    const types = [
        { id: 'all', label: 'All', icon: '' },
        { id: 'temperature', label: 'Temp', icon: '' },
        { id: 'humidity', label: 'Hum', icon: '' },
        { id: 'airPollution', label: 'Poll', icon: '' }
    ];

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Filter Buttons */}
            <div className="flex gap-1 mb-4 shrink-0">
                {types.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveType(t.id)}
                        className={`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold uppercase transition-all border ${activeType === t.id
                                ? 'bg-accent-green border-accent-green text-black shadow-[0_0_10px_rgba(46,204,113,0.2)]'
                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                            }`}
                    >
                        <span className="mr-1 opacity-70">{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto h-full pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {filteredAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-20">
                        <span className="text-3xl">🛡️</span>
                        <p className="text-[10px] uppercase mt-2">No {activeType !== 'all' ? activeType : ''} Alerts</p>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => {
                        const isSelected = alert._id === selectedAlertId;
                        const u = alert.measureID?.sensorID?.userID;
                        const country = u?.location || alert.location || 'Worldwide';
                        const userIdShort = u?._id ? `#${u._id.toString().slice(-4).toUpperCase()}` : 'SYSTEM';
                        const room = alert.location || 'Unknown Device';
                        const tenants = u?.personsInHouse || 0;
                        const hSize = u?.houseSize || 'N/A';

                        return (
                            <div
                                key={alert._id}
                                onClick={() => onAlertSelect(alert)}
                                className={`cursor-pointer border-l-4 p-3 rounded-r-xl transition-all duration-300 ${isSelected
                                    ? 'bg-white/15 border-accent-green shadow-lg scale-[1.02]'
                                    : 'bg-white/5 border-red-500 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1 text-gray-400">
                                    <div className="flex flex-col">
                                        <h4 className={`font-bold text-[11px] ${isSelected ? 'text-accent-green' : 'text-gray-200'}`}>
                                            {country} <span className="opacity-50 mx-1">—</span> {userIdShort}
                                        </h4>
                                        <p className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">
                                            Zone: {room} — <span className="text-gray-400">{tenants} tenants ({hSize})</span>
                                        </p>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${isSelected ? 'bg-accent-green/20 text-accent-green' : 'bg-red-500/20 text-red-500'
                                        }`}>
                                        {alert.type || 'Alert'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-3 text-[9px] text-gray-500 font-mono">
                                    <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                                    <span>VAL: {alert.value}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AnomalyFeed;