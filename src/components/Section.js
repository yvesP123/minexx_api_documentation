import React from 'react';
import '../styles/Section.css';

const Section = ({ id, title, children }) => {
  return (
    <div className="section" id={id}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Section;