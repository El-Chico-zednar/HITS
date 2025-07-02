import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SituationTrackerApp = () => {
  const [hasAnsweredToday, setHasAnsweredToday] = useState(false);
  const [responses, setResponses] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Opciones de respuesta con sus puntuaciones
  const options = [
    { text: 'WE ARE SO BACK', points: 3, icon: '↗' },
    { text: 'WE ARE BACK', points: 1, icon: '↑' },
    { text: 'IT IS OVER', points: -1, icon: '↓' },
    { text: 'IT IS SO OVER', points: -3, icon: '↘' }
  ];

  // Simular datos existentes para demo
  useEffect(() => {
    const mockData = generateMockData();
    setResponses(mockData);
    setCurrentScore(mockData.reduce((sum, item) => sum + item.points, 0));
    
    // Verificar si ya respondió hoy
    const today = new Date().toDateString();
    const hasResponseToday = mockData.some(response => 
      new Date(response.date).toDateString() === today
    );
    setHasAnsweredToday(hasResponseToday);
  }, []);

  const generateMockData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 30; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const randomChoice = options[Math.floor(Math.random() * options.length)];
      data.push({
        date: date.toISOString(),
        points: randomChoice.points,
        response: randomChoice.text,
        cumulativeScore: data.length > 0 ? 
          data[data.length - 1].cumulativeScore + randomChoice.points : 
          randomChoice.points
      });
    }
    
    return data;
  };

  const handleResponse = (option) => {
    setSelectedOption(option);
    setIsAnimating(true);
    
    setTimeout(() => {
      const newResponse = {
        date: new Date().toISOString(),
        points: option.points,
        response: option.text,
        cumulativeScore: currentScore + option.points
      };

      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);
      setCurrentScore(currentScore + option.points);
      setHasAnsweredToday(true);
      setIsAnimating(false);
      setSelectedOption(null);
    }, 1000);
  };

  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return responses;
    }

    return responses.filter(response => new Date(response.date) >= startDate);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const PixelButton = ({ option, onClick, isSelected, disabled }) => (
    <button
      onClick={() => onClick(option)}
      disabled={disabled}
      className={`w-full p-4 border-2 border-black bg-white hover:bg-gray-100 
        transition-all duration-200 font-mono text-lg font-bold
        ${isSelected ? 'bg-gray-200 animate-pulse' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-1'}
        flex items-center justify-start space-x-4`}
      style={{
        fontFamily: 'Monaco, "Courier New", monospace',
        letterSpacing: '2px'
      }}
    >
      <div className="w-8 h-8 border-2 border-black flex items-center justify-center bg-gray-50 text-xl">
        {option.icon}
      </div>
      <span>{option.text}</span>
    </button>
  );

  if (!hasAnsweredToday) {
    return (
      <div 
        className="min-h-screen bg-gray-300 flex items-center justify-center p-4"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0),
            radial-gradient(circle at 3px 3px, rgba(0,0,0,0.1) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 40px 40px'
        }}
      >
        <div className="w-full max-w-2xl">
          {/* Header Window */}
          <div className="bg-white border-4 border-black mb-8">
            <div className="bg-black text-white p-2 font-mono text-xs flex items-center">
              <div className="flex space-x-1 mr-4">
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-white"></div>
              </div>
              <span>SITUATION.EXE</span>
            </div>
            <div className="p-8 text-center">
              <h1 
                className="text-4xl font-bold mb-4 font-mono tracking-wider"
                style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
              >
                HOW IS THE<br />SITUATION?
              </h1>
              <p 
                className="text-gray-600 font-mono text-lg tracking-wide"
                style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
              >
                SELECT YOUR STATUS
              </p>
            </div>
          </div>

          {/* Options Window */}
          <div className="bg-white border-4 border-black">
            <div className="bg-black text-white p-2 font-mono text-xs flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex space-x-1 mr-4">
                  <div className="w-3 h-3 bg-white"></div>
                </div>
                <span>OPTIONS</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-white"></div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Positive Options */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-0 h-0 border-l-4 border-l-black border-t-4 border-t-transparent border-b-4 border-b-transparent mr-2"></div>
                  <div className="flex-1 h-px bg-black"></div>
                </div>
                <div className="space-y-3">
                  <PixelButton 
                    option={options[0]} 
                    onClick={handleResponse}
                    isSelected={selectedOption === options[0]}
                    disabled={isAnimating}
                  />
                  <PixelButton 
                    option={options[1]} 
                    onClick={handleResponse}
                    isSelected={selectedOption === options[1]}
                    disabled={isAnimating}
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="my-6 border-t-2 border-dotted border-black"></div>

              {/* Negative Options */}
              <div>
                <div className="space-y-3">
                  <PixelButton 
                    option={options[2]} 
                    onClick={handleResponse}
                    isSelected={selectedOption === options[2]}
                    disabled={isAnimating}
                  />
                  <PixelButton 
                    option={options[3]} 
                    onClick={handleResponse}
                    isSelected={selectedOption === options[3]}
                    disabled={isAnimating}
                  />
                </div>
                <div className="flex items-center mt-3">
                  <div className="flex-1 h-px bg-black"></div>
                  <div className="w-0 h-0 border-r-4 border-r-black border-t-4 border-t-transparent border-b-4 border-b-transparent ml-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p 
              className="font-mono text-lg tracking-wider"
              style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
            >
              {responses.length} DAYS LOGGED
            </p>
          </div>

          {/* Loading Modal */}
          {isAnimating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white border-4 border-black p-8 max-w-sm w-full mx-4">
                <div className="bg-black text-white p-2 font-mono text-xs mb-4">
                  <span>PROCESSING...</span>
                </div>
                <div className="text-center">
                  <div className="mb-4 text-6xl animate-pulse">
                    {selectedOption?.icon}
                  </div>
                  <p className="font-mono text-lg mb-4 tracking-wide">
                    LOGGING STATUS...
                  </p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-3 h-3 bg-black animate-pulse"></div>
                    <div className="w-3 h-3 bg-black animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-black animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-300 p-4"
      style={{
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0),
          radial-gradient(circle at 3px 3px, rgba(0,0,0,0.1) 1px, transparent 0)
        `,
        backgroundSize: '20px 20px, 40px 40px'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-4 border-black mb-6">
          <div className="bg-black text-white p-2 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex space-x-1 mr-4">
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-white"></div>
                <div className="w-3 h-3 bg-white"></div>
              </div>
              <span>SITUATION TRACKER</span>
            </div>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="p-6 text-center">
            <h1 
              className="text-3xl font-bold mb-4 font-mono tracking-wider"
              style={{ fontFamily: 'Monaco, "Courier New", monospace' }}
            >
              CURRENT STATUS
            </h1>
            
            <div className="bg-gray-100 border-2 border-black p-6 inline-block">
              <div className="text-6xl mb-2">
                {currentScore > 5 ? '↗' : currentScore > 0 ? '↑' : currentScore > -5 ? '↓' : '↘'}
              </div>
              <div className="font-mono text-3xl font-bold tracking-wider">
                SCORE: {currentScore > 0 ? '+' : ''}{currentScore}
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white border-4 border-black mb-6">
          <div className="bg-black text-white p-2 font-mono text-xs">
            <span>VIEW PERIOD</span>
          </div>
          <div className="p-4 flex justify-center space-x-4">
            {[
              { key: 'week', label: 'WEEK' },
              { key: 'month', label: 'MONTH' },
              { key: 'year', label: 'YEAR' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-6 py-3 border-2 border-black font-mono font-bold tracking-wide
                  ${selectedPeriod === period.key
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border-4 border-black mb-6">
          <div className="bg-black text-white p-2 font-mono text-xs">
            <span>TIMELINE - LAST {selectedPeriod.toUpperCase()}</span>
          </div>
          
          <div className="p-6">
            <div className="h-64 bg-gray-50 border-2 border-gray-300">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getFilteredData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#000"
                    style={{ fontFamily: 'Monaco, "Courier New", monospace', fontSize: '10px' }}
                  />
                  <YAxis 
                    stroke="#000"
                    style={{ fontFamily: 'Monaco, "Courier New", monospace', fontSize: '10px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid black',
                      borderRadius: '0',
                      fontFamily: 'Monaco, "Courier New", monospace',
                      fontSize: '12px'
                    }}
                    labelFormatter={(value) => `DATE: ${formatDate(value)}`}
                    formatter={(value, name) => [value, 'SCORE']}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeScore"
                    stroke="#000"
                    strokeWidth={3}
                    dot={{ fill: '#000', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#000', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Responses */}
        <div className="bg-white border-4 border-black">
          <div className="bg-black text-white p-2 font-mono text-xs">
            <span>RECENT ENTRIES</span>
          </div>
          
          <div className="p-6">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {responses.slice(-8).reverse().map((response, index) => {
                const option = options.find(opt => opt.text === response.response);
                return (
                  <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-300 p-3 font-mono text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border border-black flex items-center justify-center bg-white text-sm">
                        {option?.icon}
                      </div>
                      <div>
                        <span className="font-bold tracking-wide">{response.response}</span>
                        <div className="text-xs text-gray-600">
                          {new Date(response.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold">
                      {response.points > 0 ? '+' : ''}{response.points}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reset Button for Demo */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setHasAnsweredToday(false);
              setIsAnimating(false);
              setSelectedOption(null);
            }}
            className="bg-white border-2 border-black px-6 py-2 font-mono font-bold hover:bg-gray-100 tracking-wide"
          >
            ANSWER AGAIN (DEMO)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SituationTrackerApp;