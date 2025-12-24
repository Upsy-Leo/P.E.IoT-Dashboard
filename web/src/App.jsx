import { useState, useEffect } from 'react';
import axios from 'axios';
import MeasureChart from './widgets/MeasureChart';
import DigitalPlant from './widgets/DigitalPlant';
import AnomalyFeed from './widgets/AnomalyFeed';
import SensorInfo from './widgets/SensorInfo';
import MiniTodo from './widgets/MiniTodo';
import WeatherWidget from './widgets/WeatherWidget';
import CustomDropdown from './components/CustomDropdown';
import AdminPage from './pages/AdminPage';


function App() {
  const [filter, setFilter] = useState({ scope: 'worldwide', value: '' });
  const [options, setOptions] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'admin'

  useEffect(() => {
    if (filter.scope === 'worldwide') {
      setOptions([]);
      setFilter(prev => ({ ...prev, value: '' }));
    } else {
      setOptions([]);
      const endpoint = filter.scope === 'country' ? 'api/users/locations' : 'api/users'
      axios.get(`http://localhost:3000/${endpoint}`)
        .then(res => setOptions(res.data))
        .catch(err => console.error(err))
    }
  }, [filter.scope]);

  const scopeOptions = [
    { value: 'worldwide', label: 'Worldwide' },
    { value: 'country', label: 'Country' },
    { value: 'user', label: 'User' }
  ];

  const valueOptions = options.map(opt => {
    if (filter.scope === 'user') {
      return {
        value: opt._id || '',
        label: opt.username || (opt._id ? `User ${opt._id.slice(-4)}` : 'User')
      };
    }
    return { value: opt, label: opt };
  });

  return (
    <div className="flex h-screen w-screen bg-dark-bg text-white overflow-hidden font-sans">

      {/* 1. SIDEBAR GAUCHE (Étroite, style IoT) */}
      <aside className="w-20 flex flex-col items-center py-6 border-r border-gray-800/30 shrink-0">
        <div className="w-10 h-10 bg-accent-green rounded-xl mb-10 flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(46,204,113,0.3)]">
          IoT
        </div>
        <nav className="flex flex-col gap-8">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-12 h-12 rounded-xl text-xl neumorphic-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          >
            📊
          </button>
          <button
            onClick={() => setCurrentPage('admin')}
            className={`w-12 h-12 rounded-xl text-xl neumorphic-button ${currentPage === 'admin' ? 'active' : ''}`}
          >
            ⚙️
          </button>
        </nav>
      </aside>

      {/* 2. CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col p-6 h-full overflow-hidden">

        {/* TOP BAR (Header compact) */}
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-3">
            {currentPage === 'dashboard' ? (
              <>
                <CustomDropdown
                  icon="🌐"
                  options={scopeOptions}
                  value={filter.scope}
                  onChange={(val) => {
                    setFilter({ scope: val, value: '' });
                    setOptions([]);
                  }}
                />

                {filter.scope !== 'worldwide' && (
                  <CustomDropdown
                    placeholder={`Select ${filter.scope}...`}
                    options={valueOptions}
                    value={filter.value}
                    onChange={(val) => setFilter(prev => ({ ...prev, value: val }))}
                    className="min-w-[180px]"
                  />
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">⚙️</span>
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Admin Control Panel</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-bold">Sylvie Martin</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-tighter">Operations Manager</p>
            </div>
            <div className="w-9 h-9 bg-accent-green rounded-full flex items-center justify-center text-[10px] font-black text-black shadow-lg">
              SM
            </div>
          </div>
        </header>

        {/* 3. GRILLE DES WIDGETS */}
        {currentPage === 'dashboard' ? (
          <div className="grid grid-cols-12 grid-rows-2 gap-5 flex-1 min-h-0">

            {/* Widget 1: plante digitale */}
            <DigitalPlant className="col-span-3" />

            {/* Widget 2: graphique (Glassmorphism) */}
            <div className="col-span-6 glass-card rounded-3xl p-5 shadow-2xl flex flex-col widget-transition">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 shrink-0">Sensor Measurements</p>
              <div className="flex-1 overflow-hidden">
                <MeasureChart filter={filter} />
              </div>
            </div>

            {/* Widget 3: Weather (Neumorphic) */}
            <WeatherWidget filter={filter} className="col-span-3" />

            {/* Widget 4: Alertes (Neumorphic) */}
            <div className="col-span-4 neumorphic-card rounded-3xl p-5 flex flex-col overflow-hidden widget-transition">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 shrink-0">Anomaly Feed</p>
              <div className="flex-1 overflow-hidden">
                <AnomalyFeed
                  filter={filter}
                  onAlertSelect={setSelectedAlert}
                  selectedAlertId={selectedAlert?._id}
                />
              </div>
            </div>

            {/* Widget 5: Informations (Sensor Info) */}
            <SensorInfo
              data={selectedAlert}
              onClose={() => setSelectedAlert(null)}
              className="col-span-5"
            />

            {/* Widget 6: Todo */}
            <MiniTodo className="col-span-3" />

          </div>
        ) : (
          <AdminPage />
        )}
      </main>
    </div>
  );
}

export default App;