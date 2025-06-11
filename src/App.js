import React, { useState, useEffect } from 'react';
import './App.css';

function RulesDetails({ onBack }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Consommation moyenne des transports</h2>
      <table className="mx-auto mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2">Transport</th>
            <th className="px-4 py-2">Consommation CO₂ (g/km/passager)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>🚆 Train</td><td>~14</td></tr>
          <tr><td>🚌 Bus</td><td>~68</td></tr>
          <tr><td>🚗 Voiture</td><td>~120</td></tr>
          <tr><td>🚴‍♂️ Vélo</td><td>0</td></tr>
          <tr><td>✈️ Avion</td><td>~285</td></tr>
          <tr><td>⛴️ Bateau</td><td>~180</td></tr>
        </tbody>
      </table>
      <p className="mb-6">Source : <a href="https://www.ademe.fr/particuliers-eco-citoyens/transport/deplacements/choisir-mode-transport" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ADEME</a></p>
      <button
        className="p-3 rounded bg-green-400 text-white font-bold text-lg hover:bg-green-600 transition-colors"
        onClick={onBack}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}

function RulesPage({ onStart, onShowDetails }) {
  return (
    <div className="text-center p-6 max-w-4xl mx-auto bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-4">Eco Mini Games</h1>
      <h2 className="text-xl mb-3">Règles du jeu</h2>
      <ul className="mb-4" style={{ textAlign: "left", maxWidth: 500, margin: "0 auto" }}>
        <li>🌍 Tu es le ou la maire d'une ville.</li>
        <li>🚆 Tu dois choisir et développer les moyens de transport pour ta population.</li>
        <li>💸 Gère ton budget, la pollution et le bonheur des habitants.</li>
        <li>🎯 Le but : avoir une ville heureuse et la moins polluante possible !</li>
      </ul>
      <div className="flex flex-col gap-4 items-center">
        <button
          className="p-4 rounded bg-green-400 text-white font-bold text-xl hover:bg-green-600 transition-colors"
          onClick={onStart}
        >
          Commencer
        </button>
        <button
          className="p-2 rounded bg-blue-400 text-white font-bold text-lg hover:bg-blue-600 transition-colors"
          onClick={onShowDetails}
        >
          Voir les règles détaillées
        </button>
      </div>
    </div>
  );
}

function CitySimulator({ onHome }) {
    
    const [city, setCity] = useState({
    trains: 0,
    buses: 0,
    cars: 3, // Commence avec moins de voitures
    bikes: 0,
    population: 1000,
    happiness: 50,
    pollution: 45, // Pollution de départ plus basse
    budget: 80
  });
  
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);

  // Données des transports
  const transports = {
    trains: { cost: 50, pollution: -5, happiness: 6, emoji: '🚆', name: 'Trains' },
    buses: { cost: 20, pollution: -2, happiness: 3, emoji: '🚌', name: 'Bus' },
    cars: { cost: 10, pollution: 5, happiness: 2, emoji: '🚗', name: 'Voitures' }, // Pollution réduite
    bikes: { cost: 9, pollution: -4, happiness: 4, emoji: '🚴‍♂️', name: 'Vélos' }
  };

  // Simulation automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
      
      setCity(prev => {
        let newPollution = 25; // Base pollution plus basse
        let newHappiness = 40; // Base happiness plus élevée
        
        // Calcul de la pollution et bonheur basé sur les transports
        Object.keys(transports).forEach(transport => {
          const count = prev[transport];
          const data = transports[transport];
          newPollution += count * data.pollution;
          newHappiness += count * data.happiness;
        });
        
        // Limites
        newPollution = Math.max(0, Math.min(100, newPollution));
        newHappiness = Math.max(0, Math.min(100, newHappiness));
        
        // Budget augmente avec le temps mais plus lentement
        const newBudget = Math.min(200, prev.budget + 1);
        
        return {
          ...prev,
          pollution: newPollution,
          happiness: newHappiness,
          budget: newBudget
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Vérification victoire/défaite
  useEffect(() => {
    if (city.pollution >= 90) {
      setGameOver(true);
    } else if (city.pollution <= 20 && city.happiness >= 70) {
      setGameWon(true);
    }
  }, [city.pollution, city.happiness]);

  const addTransport = (type) => {
    const transport = transports[type];
    if (city.budget >= transport.cost && !gameOver && !gameWon) {
      setCity(prev => ({
        ...prev,
        [type]: prev[type] + 1,
        budget: prev.budget - transport.cost
      }));
    }
  };

  const removeTransport = (type) => {
    if (city[type] > 0 && !gameOver && !gameWon) {
      setCity(prev => ({
        ...prev,
        [type]: prev[type] - 1,
        budget: prev.budget + Math.floor(transports[type].cost / 2)
      }));
    }
  };

  const resetGame = () => {
    setCity({
      trains: 0,
      buses: 0,
      cars: 5,
      bikes: 0,
      population: 1000,
      happiness: 50,
      pollution: 45,
      budget: 80
    });
    setGameOver(false);
    setGameWon(false);
    setTime(0);
  };

  const renderCityMap = () => {
    const buildings = [];
    const vehicles = [];
    
    // Bâtiments de base
    for (let i = 0; i < 8; i++) {
      buildings.push(
        <div
          key={`building-${i}`}
          className="absolute bg-gray-600 rounded-sm"
          style={{
            left: `${15 + (i % 4) * 20}%`,
            top: `${20 + Math.floor(i / 4) * 25}%`,
            width: '12%',
            height: '15%'
          }}
        >
          🏢
        </div>
      );
    }
    
    // Véhicules sur la map
    let vehicleIndex = 0;
    Object.keys(transports).forEach(transport => {
      for (let i = 0; i < Math.min(city[transport], 8); i++) {
        vehicles.push(
          <div
            key={`${transport}-${i}`}
            className="absolute text-2xl animate-pulse"
            style={{
              left: `${10 + (vehicleIndex % 6) * 15}%`,
              top: `${70 + Math.floor(vehicleIndex / 6) * 15}%`
            }}
          >
            {transports[transport].emoji}
          </div>
        );
        vehicleIndex++;
      }
    });

    return (
      <div className="relative w-full h-80 bg-green-200 border-4 border-green-400 rounded-lg overflow-hidden">
        {/* Routes */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-2 bg-gray-800 top-1/2"></div>
          <div className="absolute h-full w-2 bg-gray-800 left-1/2"></div>
        </div>
        
        {buildings}
        {vehicles}
        
        {/* Pollution visuelle */}
        {city.pollution > 60 && (
          <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
        )}
        {city.pollution > 80 && (
          <div className="absolute top-2 left-2 text-6xl animate-bounce">☁️</div>
        )}
      </div>
    );
  };

  if (gameOver) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-100 border-4 border-red-500 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">💀 GAME OVER!</h1>
          <p className="text-xl mb-4">La pollution a atteint un niveau critique!</p>
          <p className="text-lg mb-6">Ta ville est devenue invivable après {Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')} minutes.</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={resetGame}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors"
            >
              🔄 Recommencer
            </button>
            <button
              onClick={onHome}
              className="bg-gray-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-600 transition-colors"
            >
              🏠 Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-green-100 border-4 border-green-500 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 VICTOIRE!</h1>
          <p className="text-xl mb-4">Tu as créé une ville écologique et heureuse!</p>
          <p className="text-lg mb-6">Mission accomplie en {Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')} minutes!</p>
          <div className="mb-6">
            <p>🌱 Pollution: {city.pollution}% (objectif: ≤20%)</p>
            <p>😊 Bonheur: {city.happiness}% (objectif: ≥70%)</p>
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={resetGame}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors"
            >
              🔄 Rejouer
            </button>
            <button
              onClick={onHome}
              className="bg-gray-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-600 transition-colors"
            >
              🏠 Accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🏙️ Simulateur de Transport Urbain</h1>
      
      {/* Stats en temps réel */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')}</div>
          <div className="text-sm">Temps</div>
        </div>
        <div className={`p-4 rounded-lg text-center ${city.pollution > 70 ? 'bg-red-100' : city.pollution > 40 ? 'bg-yellow-100' : 'bg-green-100'}`}>
          <div className={`text-2xl font-bold ${city.pollution > 70 ? 'text-red-600' : city.pollution > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
            {city.pollution}%
          </div>
          <div className="text-sm">Pollution</div>
        </div>
        <div className={`p-4 rounded-lg text-center ${city.happiness < 30 ? 'bg-red-100' : city.happiness < 60 ? 'bg-yellow-100' : 'bg-green-100'}`}>
          <div className={`text-2xl font-bold ${city.happiness < 30 ? 'text-red-600' : city.happiness < 60 ? 'text-yellow-600' : 'text-green-600'}`}>
            {city.happiness}%
          </div>
          <div className="text-sm">Bonheur</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">💰{city.budget}</div>
          <div className="text-sm">Budget</div>
        </div>
      </div>

      {/* Objectifs */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
        <h3 className="font-bold mb-2">🎯 Objectif:</h3>
        <p>Réduis la pollution à ≤20% et maintiens le bonheur à ≥70% pour gagner!</p>
      </div>

      {/* Map de la ville */}
      <div className="mb-6">
        {renderCityMap()}
      </div>

      {/* Contrôles des transports */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(transports).map(([key, transport]) => (
          <div key={key} className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="text-center mb-3">
              <div className="text-3xl mb-2">{transport.emoji}</div>
              <div className="font-bold">{transport.name}</div>
              <div className="text-sm text-gray-600">Quantité: {city[key]}</div>
            </div>
            
            <div className="text-xs mb-3">
              <div>💰 Coût: {transport.cost}</div>
              <div className={transport.pollution > 0 ? 'text-red-600' : 'text-green-600'}>
                🏭 Pollution: {transport.pollution > 0 ? '+' : ''}{transport.pollution}
              </div>
              <div className="text-blue-600">😊 Bonheur: +{transport.happiness}</div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => removeTransport(key)}
                disabled={city[key] === 0}
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                -
              </button>
              <button
                onClick={() => addTransport(key)}
                disabled={city.budget < transport.cost}
                className="flex-1 bg-green-500 text-white px-2 py-1 rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <button 
          onClick={resetGame}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          🔄 Recommencer
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [showRules, setShowRules] = useState(false);

  if (showRules) {
    return <RulesDetails onBack={() => setShowRules(false)} />;
  }

  return (
    <div>
      {!started ? (
        <RulesPage
          onStart={() => setStarted(true)}
          onShowDetails={() => setShowRules(true)}
        />
      ) : (
        <CitySimulator onHome={() => setStarted(false)} />
      )}
    </div>
  );
}