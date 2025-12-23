import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Check, Trash2, ListChecks, AlertCircle } from 'lucide-react';

import CustomDropdown from '../components/CustomDropdown';

const MiniTodo = ({ className = "" }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [newPriority, setNewPriority] = useState("medium");
    const [newCategory, setNewCategory] = useState("Ops");
    const [isAdding, setIsAdding] = useState(false);

    const priorityOptions = [
        { value: 'low', label: 'Low Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'high', label: 'High Priority' }
    ];

    const categoryOptions = [
        { value: 'Ops', label: 'Ops' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Admin', label: 'Admin' },
        { value: 'System', label: 'System' }
    ];

    const fetchTodos = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/todos');
            setTodos(res.data);
        } catch (err) {
            console.error("Error fetching todos:", err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const toggleTodo = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/api/todos/${id}/toggle`);
            fetchTodos();
        } catch (err) {
            console.error("Error toggling todo:", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/todos/${id}`);
            fetchTodos();
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            await axios.post('http://localhost:3000/api/todos', {
                text: newTodo,
                priority: newPriority,
                category: newCategory
            });
            setNewTodo("");
            setNewPriority("medium");
            setNewCategory("Ops");
            setIsAdding(false);
            fetchTodos();
        } catch (err) {
            console.error("Error adding todo:", err);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-accent-green';
            case 'low': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className={`bg-card-bg rounded-3xl p-5 border border-gray-800/40 shadow-xl flex flex-col h-full overflow-hidden ${className}`}>
            <div className="flex justify-between items-center mb-4 shrink-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">Operation Checklist</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-1 rounded-lg bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-all"
                    >
                        <Plus size={14} />
                    </button>
                    <ListChecks size={14} className="text-gray-600" />
                </div>
            </div>

            {isAdding && (
                <form onSubmit={addTodo} className="mb-4 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200 relative z-[60]">
                    <input
                        autoFocus
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="New operational task..."
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white outline-none focus:border-accent-green/50 transition-all font-sans"
                    />
                    <div className="flex gap-1.5 items-center">
                        <CustomDropdown
                            options={priorityOptions}
                            value={newPriority}
                            onChange={setNewPriority}
                            className="flex-1"
                            minWidth="80px"
                        />
                        <CustomDropdown
                            options={categoryOptions}
                            value={newCategory}
                            onChange={setNewCategory}
                            className="flex-1"
                            minWidth="80px"
                        />
                        <button
                            type="submit"
                            className="bg-accent-green text-black font-black px-3 h-[32px] rounded-xl text-[9px] hover:bg-green-400 transition-all active:scale-95 shadow-[0_0_10px_rgba(56,229,170,0.15)] shrink-0"
                        >
                            ADD
                        </button>
                    </div>
                </form>
            )}

            <div className="flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col gap-2">
                    {todos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-20">
                            <Check size={24} />
                            <p className="text-[9px] uppercase mt-2">All tasks completed</p>
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div
                                key={todo._id}
                                className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${todo.completed
                                    ? 'bg-white/2 border-transparent opacity-40'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 shadow-lg'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleTodo(todo._id)}
                                    className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${todo.completed
                                        ? 'bg-accent-green border-accent-green'
                                        : 'border-gray-700 hover:border-accent-green'
                                        }`}
                                >
                                    {todo.completed && <Check size={10} className="text-black font-black" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-[11px] font-medium leading-tight truncate ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                                        {todo.text}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-1 h-1 rounded-full ${getPriorityColor(todo.priority)} shadow-[0_0_5px_rgba(255,255,255,0.2)]`}></span>
                                        <span className="text-[7px] uppercase font-bold text-gray-500 tracking-wider">
                                            {todo.category} — {todo.priority}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] uppercase tracking-widest font-black text-gray-600">
                <div className="flex gap-3">
                    <span>Active: {todos.filter(t => !t.completed).length}</span>
                    <span>Done: {todos.filter(t => t.completed).length}</span>
                </div>
                {todos.some(t => !t.completed && t.priority === 'high') && (
                    <div className="flex items-center gap-1 text-red-500/70">
                        <AlertCircle size={10} />
                        <span>High Priority Urgent</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiniTodo;
