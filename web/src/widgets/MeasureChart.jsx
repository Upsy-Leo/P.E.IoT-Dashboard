import { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MeasureChart = ({ type: initialType = "temperature", filter }) => {
    const [data, setData] = useState([]);
    const [currentType, setCurrentType] = useState(initialType);
    const [period, setPeriod] = useState('all');

    useEffect(() => {
        // Construction de l'URL sécurisée
        const scope = filter?.scope || 'worldwide';
        const value = filter?.value || '';

        let url = `http://localhost:3000/api/measures/stats?type=${currentType}&period=${period}`;

        if (scope === 'country' && value) {
            url += `&location=${value}`;
        } else if (scope === 'user' && value) {
            url += `&userId=${value}`;
        }

        axios.get(url)
            .then(res => setData(res.data))
            .catch(err => console.error("Erreur Chart API:", err));
    }, [currentType, filter, period]);

    const toggleType = (t) => setCurrentType(t);

    const colorMap = {
        temperature: '#ef4444', // Red-500
        humidity: '#3b82f6',     // Blue-500
        airPollution: '#22c55e'  // Green-500
    };
    const activeColor = colorMap[currentType] || '#2ecc71';

    return (
        // On fixe une hauteur h-[250px] pour éviter l'erreur width(-1) de Recharts
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between mb-2 px-2 items-center">
                <div className="flex gap-1">
                    {['week', 'month', '6months', 'year', 'all'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`text-[9px] px-2 py-1 rounded-md font-bold transition-all ${period === p ? 'bg-gray-200 text-black' : 'bg-transparent text-gray-500 hover:text-white'}`}
                        >
                            {p === 'week' ? '1W' : p === 'month' ? '1M' : p === '6months' ? '6M' : p === 'year' ? '1Y' : 'ALL'}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    {['temperature', 'humidity', 'airPollution'].map(t => (
                        <button
                            key={t}
                            onClick={() => toggleType(t)}
                            className={`text-[9px] px-2 py-1 rounded-lg uppercase font-bold tracking-wider transition-all ${currentType === t ? 'text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            style={currentType === t ? { backgroundColor: activeColor } : {}}
                        >
                            {t === 'airPollution' ? 'Pollution' : t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={activeColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={activeColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />

                        <XAxis
                            dataKey="_id"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4b5563', fontSize: 10 }}
                            tickFormatter={(str) => {
                                if (!str) return '';
                                const parts = str.split(' ');
                                const dateParts = parts[0].split('-');
                                const dayMonth = `${dateParts[2]}/${dateParts[1]}`;
                                return parts[1] ? `${dayMonth} ${parts[1].split(':')[0]}h` : dayMonth;
                            }}
                        />

                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10 }} />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#15191e', border: '1px solid #374151', borderRadius: '12px' }}
                            itemStyle={{ color: activeColor }}
                        />

                        <Area
                            type="monotone"
                            dataKey="averageValue"
                            stroke={activeColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MeasureChart;