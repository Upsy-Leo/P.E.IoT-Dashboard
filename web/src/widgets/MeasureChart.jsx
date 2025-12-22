import {useEffect  , useState} from "react";
import axios from "axios";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

const MeasureChart = ({type, location}) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/measures/stats?type="+type+"&location="+location)
        .then(res => {
            setData(res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, [type, location]);

    return (
    <div style={{ 
        height: '400px', // Hauteur fixe obligatoire pour ResponsiveContainer
        width: '100%', 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '300px' // Sécurité supplémentaire
    }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>Évolution : {type}</h3>
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="averageValue" stroke="#2ecc71" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
}

export default MeasureChart;


