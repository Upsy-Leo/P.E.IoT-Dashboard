import { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MeasureChart = ({ type: initialType = "temperature", filter }) => {
    const [data, setData] = useState([]);
    const [currentType, setCurrentType] = useState(initialType);

    useEffect(() => {
        // Construction de l'URL sécurisée
        const scope = filter?.scope || 'worldwide';
        const value = filter?.value || '';

        let url = `http://localhost:3000/api/measures/stats?type=${currentType}`;

        if (scope === 'country' && value) {
            url += `&location=${value}`;
        } else if (scope === 'user' && value) {
            url += `&userId=${value}`;
        }

        axios.get(url)
            .then(res => setData(res.data))
            .catch(err => console.error("Erreur Chart API:", err));
    }, [currentType, filter]);

    const toggleType = (t) => setCurrentType(t);

    return (
        // On fixe une hauteur h-[250px] pour éviter l'erreur width(-1) de Recharts
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-end gap-2 mb-2 px-2">
                {['temperature', 'humidity', 'airPollution'].map(t => (
                    <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`text-[9px] px-2 py-1 rounded-lg uppercase font-bold tracking-wider transition-all ${currentType === t ? 'bg-accent-green text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {t === 'airPollution' ? 'Pollution' : t}
                    </button>
                ))}
            </div>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />

                        <XAxis
                            dataKey="_id"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4b5563', fontSize: 10 }}
                            tickFormatter={(str) => str ? str.split('-').slice(1, 3).reverse().join('/') : ''}
                        />

                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10 }} />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#15191e', border: '1px solid #374151', borderRadius: '12px' }}
                            itemStyle={{ color: '#2ecc71' }}
                        />

                        <Area
                            type="monotone"
                            dataKey="averageValue"
                            stroke="#2ecc71"
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