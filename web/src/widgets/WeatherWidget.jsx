import { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";

const WeatherWidget = ({ filter, className = "" }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                const scope = filter?.scope || 'worldwide';
                const value = filter?.value || '';

                let url = `http://localhost:3000/api/weather`;
                if (scope === 'country' && value) {
                    url += `?location=${encodeURIComponent(value)}`;
                } else if (scope === 'user' && value) {
                    url += `?userId=${value}`;
                }

                const res = await axios.get(url);
                setWeather(res.data);
            } catch (err) {
                console.error("Erreur Weather API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, [filter]);

    const renderIcon = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'sunny': return <Sun size={48} className="text-yellow-400 animate-pulse" />;
            case 'rainy': return <CloudRain size={48} className="text-blue-400" />;
            case 'cloudy': return <Cloud size={48} className="text-gray-400" />;
            case 'windy': return <Wind size={48} className="text-teal-400" />;
            default: return <Sun size={48} className="text-yellow-400" />;
        }
    };

    if (loading && !weather) {
        return (
            <div className={`glass-card p-5 rounded-3xl flex items-center justify-center h-full ${className}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-green"></div>
            </div>
        );
    }

    return (
        <div className={`glass-card widget-transition p-5 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden ${className}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-base font-black text-white uppercase tracking-tighter">Local Weather</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{weather?.location || 'Worldwide'}</p>
                </div>
                <div className="bg-black/20 p-2 rounded-xl border border-white/5">
                    {renderIcon(weather?.condition)}
                </div>
            </div>

            <div className="flex items-end gap-2 my-4">
                <span className="text-5xl font-black text-white">{weather?.temp}°</span>
                <span className="text-sm text-gray-500 font-bold uppercase mb-2">{weather?.condition}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-blue-400" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Humidity</span>
                        <span className="text-xs font-bold text-gray-300">{weather?.humidity}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wind size={14} className="text-teal-400" />
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Wind</span>
                        <span className="text-xs font-bold text-gray-300">{weather?.wind} km/h</span>
                    </div>
                </div>
            </div>

            {/* Decor */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -z-10"></div>
        </div>
    );
};

export default WeatherWidget;
