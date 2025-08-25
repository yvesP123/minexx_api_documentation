// components/Endpoint.js - Enhanced with auto country detection
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
  const [errorMessage, setErrorMessage] = useState('');
  
  // Country code mapping
  const countryCodeMap = {
    'wr': 'Rwanda',
    'hg': 'Ghana', 
    'bg': 'Gabon',
    'cd': 'DRC',
    'rf': 'France',
    'eht': 'Ethiopia',
    'bl': 'Libya'
  };
  
  // Extract URL parameters from the path (anything in {})
  const urlParamPattern = /{([^}]+)}/g;
  const urlParamsInPath = [...path.matchAll(urlParamPattern)].map(match => match[1]);

  // Function to detect country from token and auto-fill
  const detectAndFillCountry = (token) => {
    // Look for country codes at the end of the token (case insensitive)
    const match = token.match(/\.([a-z]{2,3})$/i);
    if (match) {
      const countryCode = match[1].toLowerCase();
      const countryName = countryCodeMap[countryCode];
      if (countryName) {
        setFormData(prev => ({
          ...prev,
          country: countryName
        }));
      }
    } else {
      // Clear country if no valid code found
      setFormData(prev => ({
        ...prev,
        country: ''
      }));
    }
  };

  // Function to remove country code from token
  const cleanTokenForRequest = (token) => {
    // Remove country codes from the end of the token
    const cleanedToken = token.replace(/\.(rw|gh|gb|dc|fr|eth|lb)$/i, '');
    return cleanedToken;
  };

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
    } else if (name === 'token') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Auto-detect and fill country when token changes
      detectAndFillCountry(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTryIt = () => {
    setShowTryForm(!showTryForm);
    setErrorMessage('');
    
    if (!showTryForm) {
      const storedToken = localStorage.getItem('apiToken') || '';
      // Reset form data when opening
      setFormData({
        token: storedToken,
        platform: localStorage.getItem('apiPlatform') || '3ts',
        country: '',
        urlParams: {},
        bodyContent: bodyParams && bodyParams.length > 0 
          ? JSON.stringify(bodyParams.reduce((acc, param) => ({ ...acc, [param.name]: '' }), {}), null, 2)
          : '{}'
      });
      
      // Auto-detect country from stored token
      if (storedToken) {
        detectAndFillCountry(storedToken);
      }
      
      setCurlCommand('');
    }
  };

  const handleTestApi = () => {
    // First validate URL params if needed
    if (urlParamsInPath.length > 0) {
      const missingRequiredParams = urlParams
        .filter(param => param.required)
        .filter(param => !formData.urlParams[param.name]);
      
      if (missingRequiredParams.length > 0) {
        setErrorMessage(`Please provide values for required URL parameters: ${missingRequiredParams.map(p => p.name).join(', ')}`);
        setShowTryForm(true); // Make sure form is visible
        return;
      }
    }
    
    // Process the path by replacing URL parameters
    let processedPath = path;
    Object.entries(formData.urlParams).forEach(([key, value]) => {
      if (value) {
        processedPath = processedPath.replace(`{${key}}`, value);
      }
    });
    
    // Now call the API test function with the processed path
    onApiTest({...endpoint, processedPath}, method, processedPath);
  };

  const generateCurl = () => {
    setErrorMessage('');
    
    // Validate URL params if needed
    if (urlParamsInPath.length > 0) {
      const missingRequiredParams = urlParams
        .filter(param => param.required)
        .filter(param => !formData.urlParams[param.name]);
      
      if (missingRequiredParams.length > 0) {
        setErrorMessage(`Please provide values for required URL parameters: ${missingRequiredParams.map(p => p.name).join(', ')}`);
        return;
      }
    }
    
    // Process the path by replacing URL parameters
    let processedPath = path;
    Object.entries(formData.urlParams).forEach(([key, value]) => {
      if (value) {
        processedPath = processedPath.replace(`{${key}}`, value);
      }
    });
    
    // Build full URL with query parameters
    let fullUrl = baseApiUrl + processedPath;
    const queryParams = [];
    
    if (formData.country) {
      queryParams.push(`country=${encodeURIComponent(formData.country)}`);
    }
    
    if (queryParams.length > 0) {
      fullUrl += '?' + queryParams.join('&');
    }
    
    // Clean the token by removing country code before using it in the request
    const cleanedToken = cleanTokenForRequest(formData.token);
    
    // Create curl command with cleaned token
    let curl = `curl -X ${method} "${fullUrl}" \\
  -H "Authorization: Bearer ${cleanedToken}" \\
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

  // Function to display path with highlighted parameters
  const renderPathWithHighlightedParams = () => {
    if (urlParamsInPath.length === 0) return path;
    
    const parts = [];
    let lastIndex = 0;
    
    [...path.matchAll(urlParamPattern)].forEach((match, i) => {
      // Add the text before the parameter
      if (match.index > lastIndex) {
        parts.push(path.substring(lastIndex, match.index));
      }
      
      // Add the parameter with highlighting
      const paramName = match[1];
      const paramValue = formData.urlParams[paramName];
      
      if (paramValue) {
        parts.push(<span key={`param-${i}`} className="replaced-param">{paramValue}</span>);
      } else {
        parts.push(<span key={`param-${i}`} className="url-param">{match[0]}</span>);
      }
      
      lastIndex = match.index + match[0].length;
    });
    
    // Add any remaining text
    if (lastIndex < path.length) {
      parts.push(path.substring(lastIndex));
    }
    
    return <span className="path-with-params">{parts}</span>;
  };

  return (
    <div className="endpoint">
      <h4>
        <span className={`method ${method.toLowerCase()}`}>{method}</span>
        {renderPathWithHighlightedParams()}
        <button className="try-api-btn" onClick={handleTryIt}>Try it</button>
        <button className="test-api-btn" onClick={handleTestApi}>Test API</button>
        {method === 'GET' && (
          <button className="test-browser-btn">Test in Browser</button>
        )}
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
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          
          {/* URL Parameters with Preview */}
          {urlParamsInPath.length > 0 && (
            <div className="url-params-section">
              <h5>URL Parameters:</h5>
              <p className="url-params-help">
                Replace the {"{parameter}"} placeholders in the URL path with actual values
              </p>
              
              <div className="current-url-preview">
                <strong>Current URL:</strong> {baseApiUrl}
                {Object.entries(formData.urlParams).reduce((currentPath, [key, value]) => {
                  return value 
                    ? currentPath.replace(`{${key}}`, <span className="replaced-param">{value}</span>) 
                    : currentPath;
                }, path)}
              </div>
              
              {urlParams && urlParams.map(param => (
                <div key={param.name} className="url-param-input">
                  <label htmlFor={`urlParam_${param.name}-${id}`}>
                    {param.name} {param.required && <span className="required">*</span>}:
                  </label>
                  <input
                    type="text"
                    id={`urlParam_${param.name}-${id}`}
                    name={`urlParam_${param.name}`}
                    value={formData.urlParams[param.name] || ''}
                    onChange={handleInputChange}
                    placeholder={`Example: params (for /${param.name === 'id' ? '231' : param.name})`}
                    required={param.required}
                    className={param.required ? 'required-input' : ''}
                  />
                  <small className="param-description">{param.description}</small>
                </div>
              ))}
            </div>
          )}
          
          <label htmlFor={`token-${id}`}>
            Bearer Token:
            <small style={{ display: 'block', color: '#666', fontWeight: 'normal' }}>
             
            </small>
          </label>
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
          
          <label htmlFor={`country-${id}`}>
            Country (auto-filled from token):
            <small style={{ display: 'block', color: '#666', fontWeight: 'normal' }}>
            
            </small>
          </label>
          <input
            type="text"
            id={`country-${id}`}
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            readOnly
          />
          
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
              <p className="note">
                Note: This tool shows the API request format but doesn't execute it. 
                Copy this command to your terminal or use tools like Postman to make the actual request.
                
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Endpoint;