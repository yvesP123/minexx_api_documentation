// components/Endpoint.js
import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import Tip from './Tip';
import '../styles/Endpoint.css';

const Endpoint = ({ endpoint, onApiTest, baseApiUrl }) => {
  const { id, method, path, description, urlParams, queryParams, bodyParams, notes, hasTip } = endpoint;
  const [showTryForm, setShowTryForm] = useState(false);
  const [formData, setFormData] = useState({
    token: localStorage.getItem('apiToken') || '',
    platform: localStorage.getItem('apiPlatform') || '3ts',
    country: '',
    urlParams: {},
    bodyContent: ''
  });
  const [curlCommand, setCurlCommand] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('urlParam_')) {
      const paramName = name.replace('urlParam_', '');
      setFormData(prev => ({
        ...prev,
        urlParams: {
          ...prev.urlParams,
          [paramName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTryIt = () => {
    setShowTryForm(!showTryForm);
    
    if (!showTryForm) {
      // Reset form data when opening
      setFormData({
        token: localStorage.getItem('apiToken') || '',
        platform: localStorage.getItem('apiPlatform') || '3ts',
        country: '',
        urlParams: {},
        bodyContent: bodyParams && bodyParams.length > 0 
          ? JSON.stringify(bodyParams.reduce((acc, param) => ({ ...acc, [param.name]: '' }), {}), null, 2)
          : '{}'
      });
      setCurlCommand('');
    }
  };

  const handleTestApi = () => {
    onApiTest(endpoint, method, path);
  };

  const generateCurl = () => {
    // Build the URL with parameters
    let processedPath = path;
    
    // Replace URL parameters
    if (urlParams && urlParams.length > 0) {
      urlParams.forEach(param => {
        const paramValue = formData.urlParams[param.name];
        if (paramValue) {
          processedPath = processedPath.replace(`{${param.name}}`, paramValue);
        }
      });
    }
    
    // Build full URL with query parameters
    let fullUrl = baseApiUrl + processedPath;
    const queryParams = [];
    
    if (formData.country) {
      queryParams.push(`country=${encodeURIComponent(formData.country)}`);
    }
    
    if (queryParams.length > 0) {
      fullUrl += '?' + queryParams.join('&');
    }
    
    // Create curl command
    let curl = `curl -X ${method} "${fullUrl}" \\
  -H "Authorization: Bearer ${formData.token}" \\
  -H "x-refresh: your_refresh_token_here" \\
  -H "x-platform: ${formData.platform}"`;
    
    if ((method === 'POST' || method === 'PUT') && formData.bodyContent) {
      curl += ` \\
  -H "Content-Type: application/json" \\
  -d '${formData.bodyContent}'`;
    }
    
    setCurlCommand(curl);
    
    // Save token and platform for future use
    localStorage.setItem('apiToken', formData.token);
    localStorage.setItem('apiPlatform', formData.platform);
  };

  return (
    <div className="endpoint">
      <h4>
        <span className={`method ${method.toLowerCase()}`}>{method}</span>
        {path}
        <button className="try-api-btn" onClick={handleTryIt}>Try it</button>
        <button className="test-api-btn" onClick={handleTestApi}>Test API</button>
       
      </h4>
      
      <p><strong>Description</strong>: {description}</p>
      
      {urlParams && urlParams.length > 0 && (
        <>
          <p><strong>URL Parameters</strong>:</p>
          <ul>
            {urlParams.map(param => (
              <li key={param.name}>
                <code>{param.name}</code> ({param.required ? 'required' : 'optional'}): {param.description}
              </li>
            ))}
          </ul>
        </>
      )}
      
      {queryParams && queryParams.length > 0 && (
        <>
          <p><strong>Query Parameters</strong>:</p>
          <ul>
            {queryParams.map(param => (
              <li key={param.name}>
                <code>{param.name}</code> ({param.required ? 'required' : 'optional'}): {param.description}
              </li>
            ))}
          </ul>
        </>
      )}
      
      {bodyParams && bodyParams.length > 0 && (
        <>
          <p><strong>Request Body</strong>:</p>
          <ul>
            {bodyParams.map(param => (
              <li key={param.name}>
                <code>{param.name}</code> ({param.required ? 'required' : 'optional'}): {param.description}
              </li>
            ))}
          </ul>
        </>
      )}
      
      {notes && <p><strong>Notes</strong>: {notes}</p>}
      
      {hasTip && (
        <Tip>
          <p><strong>How to use this API:</strong> Click the "Try it" button to generate a curl command, then copy and execute it in your terminal to see real results.</p>
        </Tip>
      )}
      
      {showTryForm && (
        <div className="try-it-form">
          <label htmlFor={`token-${id}`}>Bearer Token:</label>
          <input
            type="text"
            id={`token-${id}`}
            name="token"
            value={formData.token}
            onChange={handleInputChange}
            placeholder="Enter your access token"
          />
          
          <label htmlFor={`platform-${id}`}>Platform:</label>
          <select
            id={`platform-${id}`}
            name="platform"
            value={formData.platform}
            onChange={handleInputChange}
          >
            <option value="3ts">3ts</option>
            <option value="gold">gold</option>
          </select>
          
          <label htmlFor={`country-${id}`}>Country (optional):</label>
          <input
            type="text"
            id={`country-${id}`}
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="e.g. Rwanda"
          />
          
          {urlParams && urlParams.length > 0 && (
            <>
              <h5>URL Parameters:</h5>
              {urlParams.map(param => (
                <div key={param.name}>
                  <label htmlFor={`urlParam_${param.name}-${id}`}>{param.name}:</label>
                  <input
                    type="text"
                    id={`urlParam_${param.name}-${id}`}
                    name={`urlParam_${param.name}`}
                    value={formData.urlParams[param.name] || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter ${param.name} value`}
                    required={param.required}
                  />
                </div>
              ))}
            </>
          )}
          
          {(method === 'POST' || method === 'PUT') && (
            <>
              <label htmlFor={`body-${id}`}>Request Body (JSON format):</label>
              <textarea
                id={`body-${id}`}
                name="bodyContent"
                value={formData.bodyContent}
                onChange={handleInputChange}
                rows={8}
                placeholder="Enter JSON request body"
              />
            </>
          )}
          
          <button className="execute-btn" onClick={generateCurl}>
            Generate Command
          </button>
          
          {curlCommand && (
            <div className="result-container" style={{ display: 'block' }}>
              <h5>API Request:</h5>
              <CodeBlock copyable={true}>
                {curlCommand}
              </CodeBlock>
              <p className="note">Note: This tool shows the API request format but doesn't execute it. Copy this command to your terminal or use tools like Postman to make the actual request.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Endpoint;