// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import '../styles/Sidebar.css';

const Sidebar = ({ searchTerm, setSearchTerm }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // This would typically be fetched from an API or defined in a config
    setSections([
      { id: 'overview', title: 'Overview', type: 'section' },
      { id: 'authentication', title: 'Authentication', type: 'section' },
      { id: 'authentication-flow', title: 'Authentication Flow', type: 'subsection' },
      { id: 'authentication-response', title: 'Authentication Response', type: 'subsection' },
      { id: 'api-endpoints', title: 'API Endpoints', type: 'section' },
      { id: 'assessments', title: 'Assessments', type: 'subsection' },
      { id: 'companies', title: 'Companies', type: 'subsection' },
      { id: 'exports', title: 'Exports', type: 'subsection' },
      { id: 'incidents', title: 'Incidents', type: 'subsection' },
      { id: 'integrations', title: 'Integrations', type: 'subsection' },
      { id: 'mines', title: 'Mines', type: 'subsection' },
      { id: 'overview-reports', title: 'Overview Reports', type: 'subsection' },
      { id: 'purchases', title: 'Purchases', type: 'subsection' },
      { id: 'reporting', title: 'Reporting', type: 'subsection' },
      { id: 'user-management', title: 'User Management', type: 'subsection' },
      { id: 'response-codes', title: 'Response Codes', type: 'section' },
      { id: 'error-handling', title: 'Error Handling', type: 'section' },
      { id: 'example-requests', title: 'Example Requests', type: 'section' },
      { id: 'rate-limiting', title: 'Rate Limiting', type: 'section' },
      { id: 'support', title: 'Support', type: 'section' }
    ]);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <aside id="api-sidebar">
      <div id="search-container">
        <input 
          type="text" 
          id="api-search" 
          placeholder="Search API..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              to={section.id}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className={section.type === 'section' ? 'nav-section' : 'nav-subsection'}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;