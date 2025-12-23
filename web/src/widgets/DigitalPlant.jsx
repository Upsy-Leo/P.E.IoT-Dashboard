import { useState } from "react";
import { Sprout, Leaf, Flower, Flower2, TreeDeciduous, TreePalm, TreePine, Trees } from "lucide-react";

const DigitalPlant = ({ className = "" }) => {
    // Mock data for initial UI dev
    const [xp, setXp] = useState(850);
    const [level, setLevel] = useState(1);
    const maxXp = 1000;
    const progress = (xp / maxXp) * 100;

    // Render plant based on level (simplified logic for now)
    const renderPlant = () => {
        if (level < 3) return <Leaf size={64} className="text-accent-green" />;
        if (level < 5) return <Sprout size={64} className="text-accent-green" />;
        if (level < 8) return <Flower2 size={64} className="text-accent-green" />;
        if (level < 15) return <TreePine size={64} className="text-accent-green" />;
        return <Trees size={64} className="text-accent-green" />;
    };

    return (
        <div className={`bg-card-bg p-5 rounded-3xl shadow-xl flex flex-col items-center justify-between h-full relative overflow-hidden border border-gray-800/40 ${className}`}>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -z-10"></div>

            <div className="w-full">
                <h2 className="text-base font-semibold text-gray-100">Digital Plant</h2>
                <p className="text-xs text-gray-500 mt-1">Resolve alerts to grow</p>
            </div>

            {/* Main Circle Visual */}
            <div className="relative w-28 h-28 flex items-center justify-center my-1">
                {/* Outer Glow */}
                <div className="absolute w-full h-full bg-black/40 rounded-full border border-gray-800/50 shadow-inner"></div>

                {/* Plant Icon */}
                <div className="z-10 animate-bounce-slow transform transition-all duration-500">
                    {renderPlant()}
                </div>

                {/* Level Indicator Bubble */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg z-20">
                    <span className="text-[9px] font-bold text-accent-green">L{level}</span>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-1">
                <div className="flex justify-between text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                    <span>{xp} XP</span>
                    <span>{maxXp} XP</span>
                </div>

                <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-green-600 to-accent-green rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(46,204,113,0.3)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-300">Growing strong</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-wide mt-0.5">Keep resolving alerts to grow!</p>
            </div>
        </div>
    );
};

export default DigitalPlant;
