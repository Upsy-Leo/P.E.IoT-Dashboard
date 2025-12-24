import { useState, useEffect } from "react";
import axios from "axios";
import { Sprout, Leaf, Flower, Flower2, TreeDeciduous, TreePalm, TreePine, Trees } from "lucide-react";

const DigitalPlant = ({ className = "" }) => {
    const [user, setUser] = useState(null);
    const maxXp = 1000;

    useEffect(() => {
        const fetchXP = () => {
            axios.get("http://localhost:3000/api/users/me")
                .then(res => setUser(res.data))
                .catch(err => console.error("Erreur XP API:", err));
        };

        fetchXP();
        const interval = setInterval(fetchXP, 10000);
        return () => clearInterval(interval);
    }, []);

    const xp = user?.xp || 0;
    const level = user?.level || 1;
    const progress = (xp / maxXp) * 100;

    // Rendu de la plante en fonction du niveau
    const renderPlant = () => {
        if (level < 3) return <Leaf size={64} className="text-accent-green" />;
        if (level < 5) return <Sprout size={64} className="text-accent-green" />;
        if (level < 8) return <Flower2 size={64} className="text-accent-green" />;
        if (level < 15) return <TreePine size={64} className="text-accent-green" />;
        return <Trees size={64} className="text-accent-green" />;
    };

    return (
        <div className={`glass-card widget-transition p-5 rounded-3xl flex flex-col items-center justify-between h-full relative overflow-hidden ${className}`}>

            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 rounded-full blur-3xl -z-10"></div>

            <div className="w-full">
                <h2 className="text-base font-semibold text-gray-100">Plante Digitale</h2>
            </div>

            {/* Cercle principal */}
            <div className="relative w-28 h-28 flex items-center justify-center my-1">

                <div className="absolute w-full h-full bg-black/40 rounded-full border border-gray-800/50 shadow-inner"></div>


                <div className="z-10 animate-bounce-slow transform transition-all duration-500">
                    {renderPlant()}
                </div>


                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shadow-lg z-20">
                    <span className="text-[9px] font-bold text-accent-green">L{level}</span>
                </div>
            </div>

            {/* Barre de progression */}
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

            {/* Texte */}
            <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-300">Votre plante grandit avec vous !</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-wide mt-0.5">Continuez à résoudre les alertes pour la faire grandir !</p>
            </div>
        </div>
    );
};

export default DigitalPlant;
