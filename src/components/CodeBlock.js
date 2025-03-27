
// components/CodeBlock.js
import React, { useState } from 'react';
import '../styles/CodeBlock.css';

const CodeBlock = ({ children, language = '', copyable = true }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="code-block-container">
      <pre className={`code-block ${language}`}>
        <code>{children}</code>
        {copyable && (
          <button 
            className="copy-btn" 
            onClick={copyToClipboard}
            aria-label="Copy to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </pre>
    </div>
  );
};

export default CodeBlock;