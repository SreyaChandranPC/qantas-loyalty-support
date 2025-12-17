import React, { useState } from 'react';
import './SRClosureSection.css';

const SRClosureSection = () => {
  const [srNumber, setSrNumber] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  const handleSrNumberChange = (event) => {
    const value = event.target.value;
    setSrNumber(value);
    
    if (value.trim()) {
      generateScript(value.trim());
    } else {
      setGeneratedScript('');
    }
  };

  const generateScript = (srNum) => {
    const script = `Update INTSRVREQ set REQSTA='R', UPDDAT=CURRENT_TIMESTAMP::timestamp(0) where cmpcod='QF' and REQIDR ='${srNum}';
commit;`;
    
    setGeneratedScript(script);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript).then(() => {
      alert('Script copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const downloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `sr_closure_${srNumber}_${new Date().getTime()}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="sr-closure-section">
      <div className="input-area">
        <h4>Enter SR Number</h4>
        <div className="sr-input-group">
          <label htmlFor="sr-number" className="input-label">
            SR Number:
          </label>
          <input
            type="text"
            id="sr-number"
            value={srNumber}
            onChange={handleSrNumberChange}
            placeholder="Enter SR number"
            className="sr-input"
          />
        </div>
        
        {srNumber && (
          <div className="sr-summary">
            <p><strong>SR Number:</strong> {srNumber}</p>
          </div>
        )}
      </div>
      
      {generatedScript && (
        <div className="script-output">
          <div className="script-header">
            <h4>Generated SR Closure Script</h4>
            <div className="script-actions">
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy to Clipboard
              </button>
              <button onClick={downloadScript} className="download-btn">
                💾 Download Script
              </button>
            </div>
          </div>
          <textarea
            value={generatedScript}
            readOnly
            className="script-textarea"
            rows={4}
          />
        </div>
      )}
    </div>
  );
};

export default SRClosureSection;