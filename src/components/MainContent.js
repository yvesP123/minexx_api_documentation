// components/MainContent.js
import React, { useState } from 'react';
import { Element } from 'react-scroll';
import Endpoint from './Endpoint';
import Section from './Section';
import SubSection from './SubSection';
import CodeBlock from './CodeBlock';
import Warning from './Warning';
import Note from './Note';
import Tip from './Tip';
import '../styles/MainContent.css';

const MainContent = ({ searchTerm, handleApiTest, baseApiUrl }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Assessment endpoints
  const assessmentEndpoints = [
    {
      id: 'get-assessments',
      method: 'GET',
      path: '/assessments',
      description: 'Retrieve all assessments.',
      queryParams: [
        { name: 'country', description: 'Filter assessments by country.', required: false }
      ]
    },
    {
      id: 'get-assessment-mine',
      method: 'GET',
      path: '/assessments/mine/{id}',
      description: 'Retrieve details for a specific assessment.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the assessment.', required: true }
      ]
    },
    {
      id: 'get-assessment-noauth',
      method: 'GET',
      path: '/assessmentsnoauth/mine/',
      description: 'Get assessment details for a fixed ID (ce62eb6o) for QR code.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    },
    {
      id: 'get-assessment-mines',
      method: 'GET',
      path: '/assessments/mines/{id}',
      description: 'Get assessment details for a specific mine ID for QR code.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the mine.', required: true }
      ]
    }
  ];

  // Company endpoints
  const companyEndpoints = [
    {
      id: 'get-companies',
      method: 'GET',
      path: '/companies',
      description: 'Retrieve all companies for the requesting dashboard.',
      queryParams: [
        { name: 'country', description: 'Filter companies by country.', required: false }
      ],
      hasTip: true
    },
    {
      id: 'get-companies-all',
      method: 'GET',
      path: '/companies/all',
      description: 'Retrieve all companies from both gold and 3ts platforms.'
    },
    {
      id: 'get-company',
      method: 'GET',
      path: '/companies/{id}',
      description: 'Retrieve details for a specific company.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-owners',
      method: 'GET',
      path: '/owners/{id}',
      description: 'Get beneficial owners details for a specific company.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-shareholders',
      method: 'GET',
      path: '/shareholders/{id}',
      description: 'Get shareholders details for a specific company.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-documents',
      method: 'GET',
      path: '/documents/{id}',
      description: 'Get documents for a specific company.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-companies-noauth',
      method: 'GET',
      path: '/companiesnoAuth/{id}',
      description: 'Get specific company details for QR code.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-owners-noauth',
      method: 'GET',
      path: '/ownersnoAuth/{id}',
      description: 'Get beneficial owners details for QR code.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-shareholders-noauth',
      method: 'GET',
      path: '/shareholdersnoAuth/{id}',
      description: 'Get shareholders details for QR code.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-documents-noauth',
      method: 'GET',
      path: '/documentsnoAuth/{id}',
      description: 'Get documents for QR code.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-companies-mine',
      method: 'GET',
      path: '/companiesMine',
      description: 'Get details for a specific mine-related company with fixed ID.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    },
    {
      id: 'get-owners-mine',
      method: 'GET',
      path: '/ownersMine',
      description: 'Get beneficial owners for a specific mine-related company with fixed ID.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    },
    {
      id: 'get-shareholders-mine',
      method: 'GET',
      path: '/shareholdersMine',
      description: 'Get shareholders for a specific mine-related company with fixed ID.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    },
    {
      id: 'get-documents-mine',
      method: 'GET',
      path: '/documentsMine',
      description: 'Get documents for a specific mine-related company with fixed ID.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    }
  ];

  // Export endpoints
  const exportEndpoints = [
    {
      id: 'get-exports',
      method: 'GET',
      path: '/exports',
      description: 'Get all exports for the authenticated user.',
      queryParams: [
        { name: 'country', description: 'Filter exports by country.', required: false }
      ],
      hasNote: true
    },
    {
      id: 'get-exports-noauth',
      method: 'GET',
      path: '/exportsnoauth',
      description: 'Get all exports for QR code.'
    },
    {
      id: 'get-export',
      method: 'GET',
      path: '/exports/{id}',
      description: 'Get specific export details for the authenticated user.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the export.', required: true }
      ]
    },
    {
      id: 'get-export-noauth',
      method: 'GET',
      path: '/exportnoauth/{id}',
      description: 'Get specific export details for QR code.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the export.', required: true }
      ]
    },
    {
      id: 'get-time-tracking',
      method: 'GET',
      path: '/timeTracking',
      description: 'Get time tracking information for a specific export.',
      queryParams: [
        { name: 'id', description: 'Unique identifier for the export.', required: true }
      ]
    },
    {
      id: 'update-time-tracking',
      method: 'PUT',
      path: '/timeTracking/update',
      description: 'Update time tracking information for a specific export.',
      bodyParams: [
        { name: 'id', description: 'Unique identifier for the export.', required: true }
      ],
      notes: 'Additional fields to update in the time tracking record.'
    },
    {
      id: 'get-progressbar',
      method: 'GET',
      path: '/progressbar',
      description: 'Get progress information for a specific export.',
      queryParams: [
        { name: 'id', description: 'Unique identifier for the export.', required: true }
      ]
    }
  ];

  // Incident endpoints
  const incidentEndpoints = [
    {
      id: 'get-incidents',
      method: 'GET',
      path: '/incidents',
      description: 'Get all incidents.',
      queryParams: [
        { name: 'country', description: 'Filter incidents by country.', required: false }
      ]
    },
    {
      id: 'get-incident',
      method: 'GET',
      path: '/incidents/{id}',
      description: 'Get specific incident details.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the incident.', required: true }
      ]
    },
    {
      id: 'get-incidents-company',
      method: 'GET',
      path: '/incidents/company/{id}',
      description: 'Get all incidents for a specific company.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-incidents-mine',
      method: 'GET',
      path: '/incidents/mine/{id}',
      description: 'Get all incidents for a specific mine.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the mine.', required: true }
      ]
    },
    {
      id: 'get-incidents-noauth-mine',
      method: 'GET',
      path: '/incidentsnoauth/mine/',
      description: 'Get incidents for a specific mine for QR code using a fixed ID.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    }
  ];

  // Integration endpoints
  const integrationEndpoints = [
    {
      id: 'get-metals-api',
      method: 'GET',
      path: '/metals-api',
      description: 'Get TIN rates from MetalsAPI.'
    },
    {
      id: 'get-metals-api-yearly',
      method: 'GET',
      path: '/metals-api/yearly',
      description: 'Get yearly metals data.'
    },
    {
      id: 'post-openai-chat',
      method: 'POST',
      path: '/openai-chat',
      description: 'Interact with OpenAI(deepseek) chat service.',
      bodyParams: [
        { name: 'message', description: 'Message content to send to OpenAI(deepseek).', required: true }
      ]
    }
  ];

  // Mine endpoints
  const mineEndpoints = [
    {
      id: 'get-mines',
      method: 'GET',
      path: '/mines',
      description: 'Get all mines.'
    },
    {
      id: 'get-miners',
      method: 'GET',
      path: '/miners/{mine}',
      description: 'Get all miners for a specific mine.',
      urlParams: [
        { name: 'mine', description: 'Unique identifier for the mine.', required: true }
      ]
    },
    {
      id: 'get-mine',
      method: 'GET',
      path: '/mines/{id}',
      description: 'Get specific mine details.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the mine.', required: true }
      ]
    },
    {
      id: 'get-mine-images',
      method: 'GET',
      path: '/mines/images/{id}',
      description: 'Get images for a specific mine.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the mine.', required: true }
      ]
    },
    {
      id: 'get-mine-videos',
      method: 'GET',
      path: '/mines/videos/{id}',
      description: 'Get videos for a specific mine.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the mine.', required: true }
      ]
    },
    {
      id: 'post-image',
      method: 'POST',
      path: '/image',
      description: 'Get a specific image file.',
      bodyParams: [
        { name: 'file', description: 'File path of the image to retrieve.', required: true }
      ]
    },
    {
      id: 'get-mines-company',
      method: 'GET',
      path: '/mines/company/{id}',
      description: 'Get mines for a specific company.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the company.', required: true }
      ]
    },
    {
      id: 'get-mines-noauth',
      method: 'GET',
      path: '/minesnoauth',
      description: 'Get mine details for QR code using a fixed ID.',
      notes: 'This endpoint uses a hardcoded ID \'ce62eb6o\' and platform \'3ts\'.'
    }
  ];

  // Overview Report endpoints
  const overviewReportEndpoints = [
    {
      id: 'get-overview-assessments',
      method: 'GET',
      path: '/overview/assessments',
      description: 'Get assessments counts for the past 6 months for overview reporting.',
      queryParams: [
        { name: 'country', description: 'Filter overview by country.', required: false }
      ]
    },
    {
      id: 'get-overview-incidents',
      method: 'GET',
      path: '/overview/incidents',
      description: 'Get incidents counts for the past 6 months for overview reporting.',
      queryParams: [
        { name: 'country', description: 'Filter overview by country.', required: false }
      ]
    },
    {
      id: 'get-overview-exports',
      method: 'GET',
      path: '/overview/exports',
      description: 'Get exports counts for the past 6 months for overview reporting.',
      queryParams: [
        { name: 'country', description: 'Filter overview by country.', required: false }
      ]
    },
    {
      id: 'get-overview-risks',
      method: 'GET',
      path: '/overview/risks',
      description: 'Get incidents risks counts for overview reporting.',
      queryParams: [
        { name: 'country', description: 'Filter overview by country.', required: false }
      ]
    }
  ];

  // Purchase endpoints
  const purchaseEndpoints = [
    {
      id: 'get-purchases',
      method: 'GET',
      path: '/purchases',
      description: 'Get all purchases for the requesting user.'
    },
    {
      id: 'get-report-daily',
      method: 'GET',
      path: '/report/daily',
      description: 'Get daily purchase report.'
    },
    {
      id: 'get-report-mtd',
      method: 'GET',
      path: '/report/mtd',
      description: 'Get month-to-date balance report.'
    },
    {
      id: 'get-report-deliveries',
      method: 'GET',
      path: '/report/deliveries',
      description: 'Get purchase deliveries report.'
    }
  ];

  // Reporting endpoints
  const reportingEndpoints = [
    {
      id: 'get-logs',
      method: 'GET',
      path: '/logs',
      description: 'Get all system logs. Requires user to be admin.'
    },
    {
      id: 'get-admin-selection',
      method: 'GET',
      path: '/admin/{selection}',
      description: 'Get specific admin overview report.',
      urlParams: [
        { name: 'selection', description: 'The database to report on. Values can be \'production\', \'blending\' or \'processing\' for 3Ts and \'production\' or \'purchase\' for Gold.', required: true }
      ]
    },
    {
      id: 'get-sessions',
      method: 'GET',
      path: '/sessions',
      description: 'Get all user sessions. Requires user to be admin.'
    },
    {
      id: 'get-report-daily-country',
      method: 'GET',
      path: '/report/daily',
      description: 'Get daily report.',
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-mtd-country',
      method: 'GET',
      path: '/report/mtd',
      description: 'Get month-to-date balance report.',
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-deliveries-country',
      method: 'GET',
      path: '/report/deliveries',
      description: 'Get purchase deliveries report.',
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-trace',
      method: 'GET',
      path: '/report/trace/{id}',
      description: 'Get trace report for a specific company or entity.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the entity to trace.', required: true }
      ],
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-sales',
      method: 'GET',
      path: '/report/sales/{mineral}',
      description: 'Get sales report for a specific mineral.',
      urlParams: [
        { name: 'mineral', description: 'The mineral type to report on.', required: true }
      ],
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-salesrange',
      method: 'GET',
      path: '/report/salesrange/{mineral}',
      description: 'Get sales report for a specific mineral within a date range.',
      urlParams: [
        { name: 'mineral', description: 'The mineral type to report on.', required: true }
      ],
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false },
        { name: 'start_date', description: 'Start date for the report range (MM/DD/YYYY).', required: true },
        { name: 'end_date', description: 'End date for the report range (MM/DD/YYYY).', required: true }
      ]
    },
    {
      id: 'get-report-monthly',
      method: 'GET',
      path: '/report/Monthly',
      description: 'Get monthly report.',
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-purchase-monthly',
      method: 'GET',
      path: '/report/purchaseMonthly',
      description: 'Get monthly purchase report.',
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-salestrend',
      method: 'GET',
      path: '/report/salestrend',
      description: 'Get sales trend report.',
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-trendgraph',
      method: 'GET',
      path: '/report/trendgraph/{id}',
      description: 'Get trend graph for a specific entity.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the entity.', required: true }
      ],
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false }
      ]
    },
    {
      id: 'get-report-trendgraphbyyear',
      method: 'GET',
      path: '/report/trendgraphbyyear/{id}',
      description: 'Get yearly trend graph for a specific entity.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the entity.', required: true }
      ],
      queryParams: [
        { name: 'country', description: 'Filter report by country.', required: false },
        { name: 'year', description: 'Year for the trend graph.', required: true }
      ]
    }
  ];

  // User Management endpoints
  const userManagementEndpoints = [
    {
      id: 'post-login',
      method: 'POST',
      path: '/login',
      description: 'Authenticate user and create valid session credentials.',
      bodyParams: [
        { name: 'email', description: 'Valid email address.', required: true },
        { name: 'password', description: 'User password.', required: true }
      ]
    },
    {
      id: 'post-users',
      method: 'POST',
      path: '/users',
      description: 'Create a dashboard user account. Requires admin privileges.',
      bodyParams: [
        { name: 'name', description: 'User\'s first name.', required: true },
        { name: 'surname', description: 'User\'s last name.', required: true },
        { name: 'email', description: 'Valid email address.', required: true },
        { name: 'password', description: 'Password at least 8 characters long.', required: true },
        { name: 'company', description: 'User\'s company.', required: true },
        { name: 'type', description: 'User type.', required: true }
      ]
    },
    {
      id: 'delete-user',
      method: 'DELETE',
      path: '/users/{uid}',
      description: 'Delete a user account. Requires admin privileges.',
      urlParams: [
        { name: 'uid', description: 'Unique identifier for the user.', required: true }
      ]
    },
    {
      id: 'update-user',
      method: 'PUT',
      path: '/users/{uid}',
      description: 'Update a user account. Requires admin privileges.',
      urlParams: [
        { name: 'uid', description: 'Unique identifier for the user.', required: true }
      ],
      bodyParams: [
        { name: 'name', description: 'User\'s first name.', required: true },
        { name: 'surname', description: 'User\'s last name.', required: true },
        { name: 'email', description: 'Valid email address.', required: true },
        { name: 'access', description: 'User access level.', required: true }
      ]
    },
    {
      id: 'update-user-status',
      method: 'PUT',
      path: '/users/status/{uid}',
      description: 'Update a user\'s status (activate/deactivate). Requires admin privileges.',
      urlParams: [
        { name: 'uid', description: 'Unique identifier for the user.', required: true }
      ]
    },
    {
      id: 'post-forgot',
      method: 'POST',
      path: '/forgot',
      description: 'Request a password reset.',
      bodyParams: [
        { name: 'email', description: 'Email address for the account.', required: true }
      ]
    },
    {
      id: 'post-password',
      method: 'POST',
      path: '/password',
      description: 'Change user password.',
      bodyParams: [
        { name: 'email', description: 'Email address for the account.', required: true },
        { name: 'password', description: 'New password.', required: true },
        { name: 'cpassword', description: 'Confirm new password.', required: true }
      ]
    },
    {
      id: 'delete-session',
      method: 'DELETE',
      path: '/sessions/{id}',
      description: 'Terminate a specific session. Requires admin privileges.',
      urlParams: [
        { name: 'id', description: 'Unique identifier for the session.', required: true }
      ]
    },
    {
      id: 'delete-all-sessions',
      method: 'DELETE',
      path: '/sessions',
      description: 'Terminate all sessions. Requires admin privileges.'
    },
    {
      id: 'get-users-platform',
      method: 'GET',
      path: '/users/{platform}',
      description: 'Get all users for a specific platform.',
      urlParams: [
        { name: 'platform', description: 'The platform to get users for (\'gold\' or \'3ts\').', required: true }
      ]
    }
  ];

  // Filter endpoints based on search term
  const filterEndpoints = (endpoints) => {
    if (!searchTerm) return endpoints;
    
    return endpoints.filter(endpoint => 
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="main-content">
      <p className="last-updated">Last Updated: March 12, 2025</p>

      <Warning>
        <h4 style={{ marginTop: 0 }}>Interactive Documentation</h4>
        <p>This documentation offers multiple ways to test the API:</p>
        <ol>
          <li><strong>Test API</strong> - Makes actual API calls directly from your browser and shows real responses</li>
          <li><strong>Test in Browser</strong> - Alternative testing method for GET requests</li>
          <li><strong>Try it</strong> - Generates a curl command that you can copy and run in your terminal</li>
          <li><strong>Export to Postman</strong> - Creates a Postman collection with all endpoints</li>
        </ol>
        <p>The "Test API" button opens a fully-featured API tester where you can execute requests and see real responses without leaving this page.</p>
        <p>For the most comprehensive testing experience, use the "Export to Postman" button to create a complete collection of all endpoints.</p>
      </Warning>

      <Element name="overview">
        <Section id="overview" title="Overview">
          <p>This document provides a comprehensive guide for interacting with our API services. The API provides access to various resources including assessments, companies, exports, incidents, mines, reporting, and user management.</p>
        </Section>
      </Element>

      <Element name="authentication">
        <Section id="authentication" title="Authentication">
          <p>All authenticated endpoints require the following headers:</p>
          <table>
            <thead>
              <tr>
                <th>Header</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>authorization</code></td>
                <td>The 'Bearer' access token received at login</td>
              </tr>
              <tr>
                <td><code>x-refresh</code></td>
                <td>The refresh token received at login to refresh access token if expired</td>
              </tr>
              <tr>
                <td><code>x-platform</code></td>
                <td>The dashboard to access. Should either be 'gold' or '3ts'. Default value: '3ts'</td>
              </tr>
            </tbody>
          </table>

          <Note>
            <p><strong>Using this documentation:</strong> This interactive documentation helps you understand how to structure API requests, but does not execute real API calls. Use the "Try it" buttons to generate properly formatted request examples that you can copy and run in your terminal or API testing tools like Postman.</p>
          </Note>

          <Element name="authentication-flow">
            <SubSection id="authentication-flow" title="Authentication Flow" toggleSection={toggleSection} isExpanded={expandedSections['authentication-flow']}>
              <ol>
                <li>Call the <code>/login</code> endpoint with valid credentials</li>
                <li>Receive access token and refresh token in the response</li>
                <li>Include these tokens in the headers of subsequent API requests</li>
                <li>If you receive a 401 error, your access token may have expired. The API will automatically use your refresh token to generate a new access token if properly configured.</li>
              </ol>
            </SubSection>
          </Element>

          <Element name="authentication-response">
            <SubSection id="authentication-response" title="Authentication Response Example" toggleSection={toggleSection} isExpanded={expandedSections['authentication-response']}>
              <CodeBlock>
{`{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Access token
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Refresh token
    "user": {
      "id": "u12345",
      "name": "John",
      "surname": "Doe",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}`}
              </CodeBlock>
            </SubSection>
          </Element>
        </Section>
      </Element>

      <Element name="api-endpoints">
        <Section id="api-endpoints" title="API Endpoints">
          <Element name="assessments">
            <SubSection id="assessments" title="Assessments" toggleSection={toggleSection} isExpanded={expandedSections['assessments']}>
              {filterEndpoints(assessmentEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="companies">
            <SubSection id="companies" title="Companies" toggleSection={toggleSection} isExpanded={expandedSections['companies']}>
              {filterEndpoints(companyEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
            </Element>

          <Element name="exports">
            <SubSection id="exports" title="Exports" toggleSection={toggleSection} isExpanded={expandedSections['exports']}>
              {filterEndpoints(exportEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="incidents">
            <SubSection id="incidents" title="Incidents" toggleSection={toggleSection} isExpanded={expandedSections['incidents']}>
              {filterEndpoints(incidentEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="integrations">
            <SubSection id="integrations" title="Integrations" toggleSection={toggleSection} isExpanded={expandedSections['integrations']}>
              {filterEndpoints(integrationEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="mines">
            <SubSection id="mines" title="Mines" toggleSection={toggleSection} isExpanded={expandedSections['mines']}>
              {filterEndpoints(mineEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="overview-reports">
            <SubSection id="overview-reports" title="Overview Reports" toggleSection={toggleSection} isExpanded={expandedSections['overview-reports']}>
              {filterEndpoints(overviewReportEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="purchases">
            <SubSection id="purchases" title="Purchases" toggleSection={toggleSection} isExpanded={expandedSections['purchases']}>
              {filterEndpoints(purchaseEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="reporting">
            <SubSection id="reporting" title="Reporting" toggleSection={toggleSection} isExpanded={expandedSections['reporting']}>
              {filterEndpoints(reportingEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>

          <Element name="user-management">
            <SubSection id="user-management" title="User Management" toggleSection={toggleSection} isExpanded={expandedSections['user-management']}>
              {filterEndpoints(userManagementEndpoints).map(endpoint => (
                <Endpoint 
                  key={endpoint.id}
                  endpoint={endpoint}
                  onApiTest={handleApiTest}
                  baseApiUrl={baseApiUrl}
                />
              ))}
            </SubSection>
          </Element>
        </Section>
      </Element>

      <Element name="response-codes">
        <Section id="response-codes" title="Response Codes">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>200</td>
                <td>Success</td>
              </tr>
              <tr>
                <td>400</td>
                <td>Bad Request</td>
              </tr>
              <tr>
                <td>401</td>
                <td>Unauthorized</td>
              </tr>
              <tr>
                <td>403</td>
                <td>Forbidden</td>
              </tr>
              <tr>
                <td>404</td>
                <td>Not Found</td>
              </tr>
              <tr>
                <td>500</td>
                <td>Server Error</td>
              </tr>
            </tbody>
          </table>
        </Section>
      </Element>

      <Element name="error-handling">
        <Section id="error-handling" title="Error Handling">
          <p>All API errors are returned in a consistent JSON format:</p>
          <CodeBlock>
{`{
  "success": false,
  "error": "Error message description"
}`}
          </CodeBlock>
        </Section>
      </Element>

      <Element name="example-requests">
        <Section id="example-requests" title="Example Requests and Responses">
          <Element name="auth-example">
            <SubSection id="auth-example" title="Authentication Example" toggleSection={toggleSection} isExpanded={expandedSections['auth-example']}>
              <div className="request-example">
                <h4>Request:</h4>
                <CodeBlock>
{`curl -X POST https://minexxapi-db-p7n5ing2cq-uc.a.run.app/login \\
  -H "Content-Type: application/json" \\
  -H "x-platform: 3ts" \\
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'`}
                </CodeBlock>
              </div>
              <div className="response-example">
                <h4>Response:</h4>
                <CodeBlock>
{`{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "u12345",
      "name": "John",
      "surname": "Doe",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}`}
                </CodeBlock>
              </div>
            </SubSection>
          </Element>

          <Element name="companies-example">
            <SubSection id="companies-example" title="Get All Companies Example" toggleSection={toggleSection} isExpanded={expandedSections['companies-example']}>
              <div className="request-example">
                <h4>Request:</h4>
                <CodeBlock>
{`curl -X GET https://minexxapi-db-p7n5ing2cq-uc.a.run.app/companies \\
  -H "Authorization: Bearer your_access_token_here" \\
  -H "x-refresh: your_refresh_token_here" \\
  -H "x-platform: 3ts"`}
                </CodeBlock>
              </div>
              <div className="response-example">
                <h4>Response:</h4>
                <CodeBlock>
{`{
  "success": true,
  "data": [
    {
      "id": "comp123",
      "name": "Mining Corporation Ltd.",
      "country": "Rwanda",
      "status": "active",
      "created": "2024-12-10T14:35:22Z"
    },
    {
      "id": "comp124",
      "name": "Mineral Exports Inc.",
      "country": "DRC",
      "status": "pending",
      "created": "2025-01-15T09:12:45Z"
    }
  ]
}`}
                </CodeBlock>
              </div>
            </SubSection>
          </Element>

          <Element name="error-example">
            <SubSection id="error-example" title="Error Response Example" toggleSection={toggleSection} isExpanded={expandedSections['error-example']}>
              <div className="request-example">
                <h4>Request:</h4>
                <CodeBlock>
{`# Invalid authentication
curl -X GET https://minexxapi-db-p7n5ing2cq-uc.a.run.app/companies \\
  -H "Authorization: Bearer invalid_token_here" \\
  -H "x-refresh: your_refresh_token_here" \\
  -H "x-platform: 3ts"`}
                </CodeBlock>
              </div>
              <div className="response-example">
                <h4>Response:</h4>
                <CodeBlock>
{`{
  "success": false,
  "error": "Unauthorized access. Authentication token is invalid or expired.",
  "code": 401
}`}
                </CodeBlock>
              </div>
            </SubSection>
          </Element>
        </Section>
      </Element>

      <Element name="rate-limiting">
        <Section id="rate-limiting" title="Rate Limiting">
          <p>The API implements rate limiting to prevent abuse. Requests are limited to 100 requests per minute per IP address.</p>
        </Section>
      </Element>
      
      <Element name="support">
        <Section id="support" title="Support">
          <p>For API support or to report issues, please contact the developer support team b.akaffou@minexx.co</p>
          <Note>
            <p><strong>API Endpoint URL:</strong> <code>https://minexxapi-db-p7n5ing2cq-uc.a.run.app</code></p>
            <p><strong>Default Platform:</strong> <code>x-platform: 3ts</code></p>
            <p>Remember to include the country parameter where applicable for filtering results.</p>
          </Note>
        </Section>
      </Element>
    </div>
  );
};

export default MainContent;