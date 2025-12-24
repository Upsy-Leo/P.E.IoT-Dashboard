import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Radio, Activity, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [measures, setMeasures] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('users'); // users, sensors, measures
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState({});

    // User Form
    const [userForm, setUserForm] = useState({
        location: '',
        houseSize: 'medium',
        personsInHouse: 2,
        role: 'Operator'
    });

    // Sensor Form
    const [sensorForm, setSensorForm] = useState({
        location: '',
        userID: ''
    });

    // Measure Form
    const [measureForm, setMeasureForm] = useState({
        type: 'temperature',
        sensorID: '',
        value: 0
    });

    const [status, setStatus] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [uRes, sRes, mRes] = await Promise.all([
                axios.get('http://localhost:3000/api/users'),
                axios.get('http://localhost:3000/api/sensors'),
                axios.get('http://localhost:3000/api/measures')
            ]);
            setUsers(uRes.data);
            setSensors(sRes.data);
            setMeasures(mRes.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        }
    };

    const getCollectionData = () => {
        if (selectedCollection === 'users') return users;
        if (selectedCollection === 'sensors') return sensors;
        return measures;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record permanently?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/${selectedCollection}/${id}`);
            showStatus('Record deleted');
            fetchInitialData();
        } catch (err) {
            showStatus('Delete failed', 'error');
        }
    };

    const startEditing = (item) => {
        setEditingId(item._id);
        const { _id, __v, createdAt, updatedAt, ...props } = item;
        setEditValue(props);
    };

    const handleEditChange = (key, value) => {
        setEditValue(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/api/${selectedCollection}/${id}`, editValue);
            showStatus('Record updated');
            setEditingId(null);
            fetchInitialData();
        } catch (err) {
            showStatus('Update failed', 'error');
        }
    };

    const renderItemProps = (item) => {
        if (selectedCollection === 'users') {
            return (
                <>
                    <p>Location: {editingId === item._id ? <input className="bg-white/5 p-1 rounded" value={editValue.location} onChange={e => handleEditChange('location', e.target.value)} /> : item.location}</p>
                    <p>Role: {editingId === item._id ? <input className="bg-white/5 p-1 rounded" value={editValue.role} onChange={e => handleEditChange('role', e.target.value)} /> : item.role}</p>
                </>
            );
        }
        if (selectedCollection === 'sensors') {
            return (
                <>
                    <p>Zone: {editingId === item._id ? <input className="bg-white/5 p-1 rounded" value={editValue.location} onChange={e => handleEditChange('location', e.target.value)} /> : item.location}</p>
                    <p>Operator: {item.userID?.location || 'None'}</p>
                </>
            );
        }
        return (
            <>
                <p>Value: {editingId === item._id ? <input type="number" className="bg-white/5 p-1 rounded" value={editValue.value} onChange={e => handleEditChange('value', e.target.value)} /> : item.value}</p>
                <p>Node: {item.sensorID?.location || 'Unknown'}</p>
            </>
        );
    };

    const showStatus = (msg, type = 'success') => {
        setStatus({ message: msg, type });
        setTimeout(() => setStatus({ message: '', type: '' }), 3000);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/users', userForm);
            showStatus('User created successfully');
            setUserForm({ location: '', houseSize: 'medium', personsInHouse: 2, role: 'Operator' });
            fetchInitialData();
        } catch (err) {
            showStatus('Error creating user', 'error');
        }
    };

    const handleCreateSensor = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/sensors', sensorForm);
            showStatus('Sensor registered successfully');
            setSensorForm({ location: '', userID: '' });
            fetchInitialData();
        } catch (err) {
            showStatus('Error creating sensor', 'error');
        }
    };

    const handleCreateMeasure = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/measures', measureForm);
            showStatus('Measure recorded. Alerts triggered if out of bounds.');
            setMeasureForm({ ...measureForm, value: 0 });
        } catch (err) {
            showStatus('Error recording measure', 'error');
        }
    };

    const inputClass = "w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-accent-green/50 transition-all font-sans mb-3";
    const labelClass = "text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1 block ml-1";
    const cardClass = "bg-card-bg/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-2xl hover:border-white/10 transition-all duration-300";

    const roles = ['Operator', 'Field Tech', 'Supervisor', 'Admin'];

    return (
        <div className="flex-1 overflow-y-auto p-4 animate-in fade-in duration-500 [scrollbar-width:none]">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter text-white">SYSTEM PROVISIONING</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Manual Database Management Control Panel</p>
                    </div>
                    {status.message && (
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-right-4 ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                            }`}>
                            {status.type !== 'error' ? <CheckCircle2 size={14} /> : <Activity size={14} />}
                            {status.message}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. USER CREATION */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <UserPlus size={20} />
                            </div>
                            <h3 className="font-bold text-gray-200 uppercase tracking-tight">Add Operator</h3>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <label className={labelClass}>Base Location (Country)</label>
                            <input
                                className={inputClass}
                                placeholder="France, Japan..."
                                value={userForm.location}
                                onChange={e => setUserForm({ ...userForm, location: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className={labelClass}>House Size</label>
                                    <CustomDropdown
                                        options={[
                                            { value: 'small', label: 'Small' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'big', label: 'Big' }
                                        ]}
                                        value={userForm.houseSize}
                                        onChange={val => setUserForm({ ...userForm, houseSize: val })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Capacity</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        style={{ marginBottom: 0 }}
                                        value={userForm.personsInHouse}
                                        onChange={e => setUserForm({ ...userForm, personsInHouse: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-2xl transition-all shadow-lg active:scale-[0.98]">
                                Register Member
                            </button>
                        </form>
                    </div>

                    {/* 2. SENSOR REGISTRATION */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                                <Radio size={20} />
                            </div>
                            <h3 className="font-bold text-gray-200 uppercase tracking-tight">Deploy Sensor</h3>
                        </div>
                        <form onSubmit={handleCreateSensor}>
                            <label className={labelClass}>Deployment Zone</label>
                            <input
                                className={inputClass}
                                placeholder="e.g. Livingroom, Factory A"
                                value={sensorForm.location}
                                onChange={e => setSensorForm({ ...sensorForm, location: e.target.value })}
                                required
                            />

                            <label className={labelClass}>Assigned To Operator</label>
                            <CustomDropdown
                                options={users.map(u => ({
                                    value: u._id,
                                    label: `${u.location} — ID: ${u._id.slice(-4)}`
                                }))}
                                value={sensorForm.userID}
                                onChange={val => setSensorForm({ ...sensorForm, userID: val })}
                                placeholder="Select Operator..."
                                className="mb-6"
                            />

                            <button
                                type="submit"
                                disabled={!sensorForm.userID}
                                className="w-full bg-accent-green hover:bg-green-400 text-black font-black uppercase tracking-widest text-[10px] py-3 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-30"
                            >
                                Activate Node
                            </button>
                        </form>
                    </div>

                    {/* 3. MEASURE INJECTION */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Activity size={20} />
                            </div>
                            <h3 className="font-bold text-gray-200 uppercase tracking-tight">Inject Data</h3>
                        </div>
                        <form onSubmit={handleCreateMeasure}>
                            <label className={labelClass}>Source Node (Sensor ID)</label>
                            <CustomDropdown
                                options={sensors.map(s => ({
                                    value: s._id,
                                    label: `ID: ${s._id.slice(-6)} — ${s.location} (${s.userID?.location || 'Unknown'})`
                                }))}
                                value={measureForm.sensorID}
                                onChange={val => setMeasureForm({ ...measureForm, sensorID: val })}
                                placeholder="Select Sensor by ID..."
                                className="mb-3"
                            />

                            <label className={labelClass}>Telemetry Type</label>
                            <CustomDropdown
                                options={[
                                    { value: 'temperature', label: 'Temperature (°C)' },
                                    { value: 'humidity', label: 'Humidity (%)' },
                                    { value: 'airPollution', label: 'Air Pollution (µg/m³)' }
                                ]}
                                value={measureForm.type}
                                onChange={val => setMeasureForm({ ...measureForm, type: val })}
                                className="mb-3"
                            />

                            <label className={labelClass}>Value</label>
                            <input
                                type="number"
                                step="0.1"
                                className={inputClass}
                                value={measureForm.value}
                                onChange={e => setMeasureForm({ ...measureForm, value: e.target.value })}
                                required
                            />

                            <button
                                type="submit"
                                disabled={!measureForm.sensorID}
                                className="w-full bg-purple-510 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-30"
                            >
                                Emit Telemetry
                            </button>
                        </form>
                    </div>
                </div>

                {/* DATA EXPLORER & MANAGEMENT */}
                <div className="bg-card-bg/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white tracking-widest uppercase">Database Explorer</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Live Management of System Records</p>
                        </div>

                        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 self-start">
                            {['users', 'sensors', 'measures'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setSelectedCollection(type);
                                        setEditingId(null);
                                    }}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCollection === type
                                        ? 'bg-accent-green text-black shadow-lg scale-105'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto [scrollbar-width:none]">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[10px] uppercase font-black text-gray-600 tracking-widest">
                                    <th className="px-4 py-2">Identity / Info</th>
                                    <th className="px-4 py-2">Properties</th>
                                    <th className="px-4 py-2 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCollectionData().map(item => (
                                    <tr key={item._id} className="group bg-white/3 hover:bg-white/5 transition-colors rounded-2xl">
                                        <td className="px-4 py-4 rounded-l-2xl">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-200">
                                                    {editingId === item._id ? (
                                                        <input
                                                            className="bg-black/40 border border-white/10 rounded px-2 py-1 outline-none text-accent-green"
                                                            value={editValue.label || item.location || item.type}
                                                            onChange={e => handleEditChange('label', e.target.value)}
                                                        />
                                                    ) : (
                                                        item.location || item.type
                                                    )}
                                                </span>
                                                <span className="text-[9px] font-mono text-gray-600">ID: {item._id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-[10px] text-gray-400 space-y-1">
                                                {renderItemProps(item)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right rounded-r-2xl">
                                            {editingId === item._id ? (
                                                <div className="flex justify-end gap-2 animate-in fade-in zoom-in duration-200">
                                                    <button
                                                        onClick={() => handleSaveEdit(item._id)}
                                                        className="p-2 bg-accent-green/10 text-accent-green hover:bg-accent-green hover:text-black rounded-lg transition-all"
                                                        title="Save Changes"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="p-2 bg-gray-500/10 text-gray-500 hover:bg-gray-500 hover:text-white rounded-lg transition-all"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEditing(item)}
                                                        className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                        title="Edit Entry"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        title="Delete Entry"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {getCollectionData().length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center justify-center opacity-30">
                                <Activity size={48} className="mb-4 text-gray-500" />
                                <p className="text-xs uppercase font-bold tracking-widest text-gray-500">No records found for {selectedCollection}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Activity Log (Condensed) */}
                <div className="bg-black/20 rounded-3xl p-6 border border-white/5 h-[150px] overflow-hidden flex flex-col">
                    <p className="text-[10px] uppercase font-black text-gray-600 tracking-widest mb-4">Operations Log</p>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] text-gray-500">
                        <p className="flex gap-2"><span className="text-gray-700">[SYSTEM]</span> Ready for data orchestration...</p>
                        {status.message && <p className="flex gap-2 animate-pulse"><span className="text-accent-green">[DB]</span> {status.message}</p>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
