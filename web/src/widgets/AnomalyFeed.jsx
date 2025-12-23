import { useEffect, useState } from 'react';
import axios from 'axios';

const AnomalyFeed = ({ filter }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const scope = filter?.scope || 'worldwide';
        const value = filter?.value || '';
        
        // On adapte l'URL pour ton backend
        let url = `http://localhost:3000/api/alerts`;
        
        // Si on a un pays spécifique, on l'ajoute en query param
        if (scope === 'country' && value) {
          url += `?location=${value}`;
        }
        // Note: Si ton backend ne gère pas encore userId dans /api/alerts, 
        // il renverra toutes les alertes par défaut.

        const res = await axios.get(url);
        setAlerts(res.data);
      } catch (err) {
        console.error("Erreur alertes:", err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Polling toutes les 15s
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-full pr-2 custom-scrollbar">
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 opacity-20">
          <span className="text-3xl">🛡️</span>
          <p className="text-[10px] uppercase mt-2">System Secure</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <div key={alert._id} className="bg-white/5 border-l-4 border-red-500 p-3 rounded-r-xl hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-[11px] text-gray-200">
                {alert.location || 'Unknown Device'}
              </h4>
              <span className="text-[9px] px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded font-bold uppercase">
                {alert.type || 'Alert'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 text-[9px] text-gray-500 font-mono">
              <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
              <span>VAL: {alert.value}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AnomalyFeed;