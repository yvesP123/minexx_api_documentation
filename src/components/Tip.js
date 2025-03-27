// components/Tip.js
import React from 'react';
import '../styles/Alert.css';

const Tip = ({ children }) => {
  return (
    <div className="tip alert">
      {children}
    </div>
  );
};

export default Tip;