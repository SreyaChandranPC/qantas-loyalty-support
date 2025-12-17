import React, { useState } from 'react';
import './AccountReopenSection.css';

const AccountReopenSection = () => {
  const [membershipNumber, setMembershipNumber] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  const handleMembershipNumberChange = (event) => {
    const value = event.target.value;
    setMembershipNumber(value);
    
    if (value.trim()) {
      generateScript(value.trim());
    } else {
      setGeneratedScript('');
    }
  };

  const generateScript = (membershipNum) => {
    const script = `call IT_MEM_ACCSTACHANGE ('QF','QFF','${membershipNum}','A',CURRENT_TIMESTAMP::timestamp(0));
update memmst set memshpsta='A',upddat=CURRENT_TIMESTAMP::timestamp(0) where memshpnum='${membershipNum}' and cmpcod='QF';
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
    element.download = `account_reopen_${membershipNumber}_${new Date().getTime()}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="account-reopen-section">
      <div className="input-area">
        <h4>Enter Membership Number</h4>
        <div className="membership-input-group">
          <label htmlFor="membership-number" className="input-label">
            Membership Number:
          </label>
          <input
            type="text"
            id="membership-number"
            value={membershipNumber}
            onChange={handleMembershipNumberChange}
            placeholder="Enter membership number"
            className="membership-input"
          />
        </div>
        
        {membershipNumber && (
          <div className="membership-summary">
            <p><strong>Membership Number:</strong> {membershipNumber}</p>
          </div>
        )}
      </div>
      
      {generatedScript && (
        <div className="script-output">
          <div className="script-header">
            <h4>Generated Account Reopen Script</h4>
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
            rows={8}
          />
        </div>
      )}
    </div>
  );
};

export default AccountReopenSection;