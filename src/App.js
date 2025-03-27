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

  const baseApiUrl = "https://minexxapi-db-p7n5ing2cq-uc.a.run.app";

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleApiTest = (endpoint, method, path) => {
    setApiTesterConfig({
      endpoint,
      method,
      path,
      token: localStorage.getItem('apiToken') || '',
      platform: localStorage.getItem('apiPlatform') || '3ts'
    });
    setShowApiTesterModal(true);
  };

  const closeApiTesterModal = () => {
    setShowApiTesterModal(false);
  };

  const saveTesterData = (token, platform) => {
    localStorage.setItem('apiToken', token);
    localStorage.setItem('apiPlatform', platform);
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