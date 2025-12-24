import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder = "Select...", icon, className = "", minWidth = "100px" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt =>
        typeof opt === 'object' ? opt.value === value : opt === value
    );

    const displayLabel = selectedOption
        ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
        : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} style={{ minWidth }} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-card-bg/50 px-3 h-[32px] rounded-xl border border-white/5 hover:border-accent-green/30 hover:bg-card-bg transition-all duration-300 w-full text-left"
            >
                {icon && <span className="text-gray-500 text-xs">{icon}</span>}
                <span className="flex-1 text-[9px] uppercase font-bold text-gray-400 truncate tracking-wider">{displayLabel}</span>
                <ChevronDown
                    size={12}
                    className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent-green' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 min-w-max">
                    <ul className="py-1 max-h-60 overflow-y-auto [scrollbar-width:none]">
                        {options.map((opt, i) => {
                            const val = typeof opt === 'object' ? opt.value : opt;
                            const label = typeof opt === 'object' ? opt.label : opt;
                            const isSelected = val === value;

                            return (
                                <li
                                    key={i}
                                    onClick={() => {
                                        onChange(val);
                                        setIsOpen(false);
                                    }}
                                    className={`px-4 py-2.5 text-xs cursor-pointer transition-all flex items-center justify-between gap-4 ${isSelected
                                        ? 'bg-accent-green/10 text-accent-green font-bold'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <span>{label}</span>
                                    {isSelected && <div className="w-1 h-1 rounded-full bg-accent-green shadow-[0_0_8px_#38e5aa]" />}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
