// components/Warning.js
import React from 'react';
import '../styles/Alert.css';

const Warning = ({ children }) => {
  return (
    <div className="warning alert">
      {children}
    </div>
  );
};

export default Warning;