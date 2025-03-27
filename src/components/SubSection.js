// components/SubSection.js
import React from 'react';
import '../styles/SubSection.css';

const SubSection = ({ id, title, children, toggleSection, isExpanded = true }) => {
  const handleToggle = () => {
    if (toggleSection) {
      toggleSection(id);
    }
  };

  return (
    <div className="subsection" id={id}>
      <h3>
        <button 
          className="toggle-btn" 
          onClick={handleToggle}
          aria-label="Toggle section"
        >
          {isExpanded ? '−' : '+'}
        </button>
        {title}
      </h3>
      <div className={`subsection-content ${isExpanded ? '' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

export default SubSection;