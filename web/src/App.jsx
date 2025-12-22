import "./App.css";
import MeasureChart from "./widgets/MeasureChart";
import {useState} from "react";

import logo from "./assets/react.svg";

function App() {
  const [selectedLocation, setSelectedLocation] = useState("worldwide");
  
  return (
   <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h1>P.E.IoT Dashboard 🌿</h1>
      
      {/* Sélecteur de pays (Widget Global) */}
      <select onChange={(e) => setSelectedLocation(e.target.value)}>
        <option value="worldwide">Tout le monde (Worldwide)</option>
        <option value="ethiopia">Éthiopie</option>
        {/* On pourra automatiser cette liste plus tard via l'API */}
      </select>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {/* Affichage du graphique pour la pollution */}
        <MeasureChart type="airPollution" location={selectedLocation} />
      </div>
    </div>
  );
}

export default App;
