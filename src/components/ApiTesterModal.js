// components/ApiTesterModal.js - Modified to better handle URL parameters
import React, { useState, useEffect } from 'react';
import '../styles/ApiTesterModal.css';

const ApiTesterModal = ({ config, onClose, baseApiUrl, onSaveData }) => {
  const { endpoint, method, path, token: initialToken, platform: initialPlatform } = config;
  
  const [token, setToken] = useState(initialToken);
  const [platform, setPlatform] = useState(initialPlatform);
  const [params, setParams] = useState({});
  const [urlParamValues, setUrlParamValues] = useState({});
  const [body, setBody] = useState({});
  const [responseOutput, setResponseOutput] = useState('Response will appear here...');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract URL parameters from the path (anything in {})
  const urlParamPattern = /{([^}]+)}/g;
  const urlParamsInPath = [...path.matchAll(urlParamPattern)].map(match => match[1]);

  useEffect(() => {
    // Initialize URL parameters
    const initialUrlParams = {};
    if (endpoint && endpoint.urlParams && endpoint.urlParams.length > 0) {
      endpoint.urlParams.forEach(param => {
        initialUrlParams[param.name] = "";
      });
    }
    setUrlParamValues(initialUrlParams);
    
    // Initialize query parameters
    const initialParams = { country: "" };
    if (endpoint && endpoint.queryParams && endpoint.queryParams.length > 0) {
      endpoint.queryParams.forEach(param => {
        if (param.name !== 'country') { // Already added country
          initialParams[param.name] = "";
        }
      });
    }
    setParams(initialParams);
    
    // Initialize request body for POST/PUT
    if (method === 'POST' || method === 'PUT') {
      const initialBody = {};
      if (endpoint && endpoint.bodyParams && endpoint.bodyParams.length > 0) {
        endpoint.bodyParams.forEach(param => {
          initialBody[param.name] = "";
        });
      }
      setBody(initialBody);
    }

    setError('');
  }, [endpoint, method, path]);

  // Handle URL parameter changes
  const handleUrlParamChange = (e) => {
    const { name, value } = e.target;
    setUrlParamValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle query parameter changes
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle JSON text area for parameters
  const handleJsonParamsChange = (e) => {
    try {
      const newParams = JSON.parse(e.target.value);
      setParams(newParams);
    } catch (error) {
      // Do not update if JSON is invalid
      console.error('Invalid JSON:', error);
    }
  };

  // Handle JSON text area for body
  const handleBodyChange = (e) => {
    try {
      const newBody = JSON.parse(e.target.value);
      setBody(newBody);
    } catch (error) {
      // Do not update if JSON is invalid
      console.error('Invalid JSON:', error);
    }
  };

  const handleExecute = async () => {
    setError('');
    
    // Check for required URL parameters
    if (urlParamsInPath.length > 0) {
      const missingParams = [];
      
      endpoint.urlParams.forEach(param => {
        if (param.required && (!urlParamValues[param.name] || urlParamValues[param.name].trim() === '')) {
          missingParams.push(param.name);
        }
      });
      
      if (missingParams.length > 0) {
        setError(`Please provide values for required URL parameters: ${missingParams.join(', ')}`);
        setResponseOutput('Error: Missing required URL parameters');
        return;
      }
    }
    
    // Save token and platform to localStorage for future use
    onSaveData(token, platform);
    
    // Process the path by replacing URL parameters
    let finalPath = path;
    Object.entries(urlParamValues).forEach(([key, value]) => {
      if (value) {
        finalPath = finalPath.replace(`{${key}}`, value);
      }
    });
    
    let finalUrl = baseApiUrl + finalPath;
    let queryParams = new URLSearchParams();
    
    // Add non-empty query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      finalUrl += '?' + queryString;
    }
    
    setIsLoading(true);
    setResponseOutput('Loading...');
    
    try {
      // Set up headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'x-refresh': 'your_refresh_token_here',
        'x-platform': platform
      };
      
      // Add Content-Type header for requests with body
      if (method === 'POST' || method === 'PUT') {
        headers['Content-Type'] = 'application/json';
      }
      
      // Prepare request options
      const requestOptions = {
        method: method,
        headers: headers,
        body: (method === 'POST' || method === 'PUT') ? JSON.stringify(body) : undefined
      };
      
      // Make API call
      const response = await fetch(finalUrl, requestOptions);
      const statusText = `Status: ${response.status} ${response.statusText}\n\n`;
      
      try {
        // Try to parse as JSON
        const data = await response.json();
        setResponseOutput(statusText + JSON.stringify(data, null, 2));
      } catch (e) {
        // If not JSON, get text content
        const text = await response.text();
        setResponseOutput(statusText + text);
      }
    } catch (error) {
      setResponseOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside to close modal
  const handleOutsideClick = (e) => {
    if (e.target.id === 'api-tester-modal') {
      onClose();
    }
  };

  return (
    <div id="api-tester-modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        
        <h3>Test API: {method} {path}</h3>
        
        <div className="api-tester-form">
          {error && <div className="error-message">{error}</div>}
          
          <label>API Endpoint:</label>
          <input 
            type="text" 
            value={baseApiUrl + path} 
            readOnly 
          />
          
          {/* URL Parameters Section */}
          {urlParamsInPath.length > 0 && (
            <div className="url-params-section">
              <h4>URL Parameters:</h4>
              <p className="url-params-help">
                Replace the {"{parameter}"} placeholders in the URL path with actual values
              </p>
              
              {endpoint.urlParams && endpoint.urlParams.map(param => (
                <div key={`url-${param.name}`} className="url-param-input">
                  <label>
                    {param.name} {param.required && <span className="required">*</span>}:
                  </label>
                  <input
                    type="text"
                    name={param.name}
                    value={urlParamValues[param.name] || ''}
                    onChange={handleUrlParamChange}
                    placeholder={`Enter value for ${param.name}`}
                  />
                  <small className="param-description">{param.description}</small>
                  
                  {/* Show what the processed URL would look like */}
                  <div className="url-preview">
                    <small>
                      {path.replace(`{${param.name}}`, 
                        urlParamValues[param.name] ? 
                        <span className="replaced-param">{urlParamValues[param.name]}</span> : 
                        `{${param.name}}`
                      )}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <label>Authorization Bearer Token:</label>
          <input 
            type="text" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
          />
          
          <label>Platform:</label>
          <select 
            value={platform} 
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="3ts">3ts</option>
            <option value="gold">gold</option>
          </select>
          
          {/* Query Parameters Section */}
          <h4>Query Parameters:</h4>
          
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={params.country || ""}
            onChange={handleParamChange}
            placeholder="Filter by country (optional)"
          />
          
          {/* Additional query parameters */}
          {endpoint && endpoint.queryParams && endpoint.queryParams.map(param => (
            param.name !== 'country' && (
              <div key={`query-${param.name}`}>
                <label>{param.name} {param.required && <span className="required">*</span>}:</label>
                <input
                  type="text"
                  name={param.name}
                  value={params[param.name] || ""}
                  onChange={handleParamChange}
                  placeholder={`${param.required ? '(Required)' : '(Optional)'} ${param.description}`}
                />
              </div>
            )
          ))}
          
          <label>All Parameters (JSON format):</label>
          <textarea 
            value={JSON.stringify(params, null, 2)} 
            onChange={handleJsonParamsChange}
          />
          
          {/* Request Body Section */}
          {(method === 'POST' || method === 'PUT') && (
            <>
              <h4>Request Body:</h4>
              <textarea 
                value={JSON.stringify(body, null, 2)} 
                onChange={handleBodyChange}
              />
            </>
          )}
          
          <button 
            className="execute-btn" 
            onClick={handleExecute}
            disabled={isLoading}
          >
            {isLoading ? 'Executing...' : `Execute ${method} Request`}
          </button>
          
          <h4>Response:</h4>
          <pre>{responseOutput}</pre>
        </div>
      </div>
    </div>
  );
};

export default ApiTesterModal;