import React, { useState } from 'react';
import './ExpandableSection.css';
import FileUploadSection from './FileUploadSection';
import AccountReopenSection from './AccountReopenSection';
import SRClosureSection from './SRClosureSection';

const ExpandableSection = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`expandable-section ${isExpanded ? 'expanded' : ''}`}>
      <div className="section-header" onClick={toggleExpansion}>
        <h3 className="section-title">{title}</h3>
        <div className={`arrow ${isExpanded ? 'rotated' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M7 10L12 15L17 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      <div className={`section-content ${isExpanded ? 'visible' : ''}`}>
        <div className="content-wrapper">
          {title.toLowerCase() === 'fqnp' ? (
            <FileUploadSection />
          ) : title.toLowerCase() === 'account reopen' ? (
            <AccountReopenSection />
          ) : title.toLowerCase() === 'sr closure' ? (
            <SRClosureSection />
          ) : title.toLowerCase() === 'output' ? (
            <div className="output-section">
              <p>This section will display the generated scripts and verification queries after you upload an Excel file in the FQNP section above.</p>
              <div className="output-info">
                <h4>📋 What you'll get:</h4>
                <ul>
                  <li>✅ FQNP execution script with 7 activity numbers per row</li>
                  <li>✅ Verification script to check activity corrections</li>
                  <li>✅ Point transaction verification queries</li>
                  <li>✅ Copy and download options for easy use</li>
                </ul>
              </div>
            </div>
          ) : (
            <p>{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandableSection;