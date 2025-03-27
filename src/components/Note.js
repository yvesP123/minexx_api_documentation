// components/Note.js
import React from 'react';
import '../styles/Alert.css';

const Note = ({ children }) => {
  return (
    <div className="note alert">
      {children}
    </div>
  );
};

export default Note;