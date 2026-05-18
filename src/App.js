// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; // Change this line
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import ApiTesterModal from './components/ApiTesterModal';
import './styles/App.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showApiTesterModal, setShowApiTesterModal] = useState(false);
  const [apiTesterConfig, setApiTesterConfig] = useState({
    endpoint: null,
    method: '',
    path: '',
    token: '',
    platform: '3ts'
  });

  // Detect if token is for Togo
  const isTogoToken = (token) => token && token.includes('.tgo');

  // Get base API URL based on token
  const getBaseApiUrl = (token) => {
    if (isTogoToken(token)) {
      return "https://minexxapi-togo-clone-p7n5ing2cq-uc.a.run.app";
    }
    return "https://minexxapi-livescreen-p7n5ing2cq-uc.a.run.app";
  };

  // Get default platform based on token
  const getDefaultPlatform = (token) => {
    if (isTogoToken(token)) {
      return 'Gold';
    }
    return '3ts';
  };

  const savedToken = localStorage.getItem('apiToken') || '';
  const baseApiUrl = getBaseApiUrl(savedToken);
  const defaultPlatform = getDefaultPlatform(savedToken);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleApiTest = (endpoint, method, path) => {
    const token = localStorage.getItem('apiToken') || '';
    setApiTesterConfig({
      endpoint,
      method,
      path,
      token: token,
      platform: localStorage.getItem('apiPlatform') || getDefaultPlatform(token)
    });
    setShowApiTesterModal(true);
  };

  const closeApiTesterModal = () => {
    setShowApiTesterModal(false);
  };

  const saveTesterData = (token, platform) => {
    localStorage.setItem('apiToken', token);
    // If token is Togo and platform not explicitly set, default to Gold
    if (isTogoToken(token) && !platform) {
      localStorage.setItem('apiPlatform', 'Gold');
    } else if (platform) {
      localStorage.setItem('apiPlatform', platform);
    }
  };

  return (
    <BrowserRouter> {/* Change Router to BrowserRouter */}
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container">
          <Sidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <MainContent 
            searchTerm={searchTerm}
            handleApiTest={handleApiTest}
            baseApiUrl={baseApiUrl}
          />
        </div>
        {showApiTesterModal && (
          <ApiTesterModal 
            config={apiTesterConfig} 
            onClose={closeApiTesterModal}
            baseApiUrl={baseApiUrl}
            onSaveData={saveTesterData}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;