import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './FileUploadSection.css';

const FileUploadSection = () => {
  const [file, setFile] = useState(null);
  const [activityNumbers, setActivityNumbers] = useState([]);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && 
          uploadedFile.type !== 'application/vnd.ms-excel') {
        setError('Please upload a valid Excel file (.xlsx or .xls)');
        return;
      }
      setFile(uploadedFile);
      setError('');
      processExcelFile(uploadedFile);
    }
  };

  const processExcelFile = (file) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Find the column index for "Ref Number (ACTNUM)"
        const headerRow = jsonData[0];
        const actNumColumnIndex = headerRow.findIndex(header => 
          header && header.toString().toLowerCase().includes('ref number') && 
          header.toString().toLowerCase().includes('actnum')
        );
        
        if (actNumColumnIndex === -1) {
          setError('Column "Ref Number (ACTNUM)" not found in the Excel file');
          setIsProcessing(false);
          return;
        }
        
        // Extract activity numbers from the found column
        const actNums = [];
        for (let i = 1; i < jsonData.length; i++) {
          const cellValue = jsonData[i][actNumColumnIndex];
          if (cellValue && cellValue.toString().trim() !== '') {
            actNums.push(cellValue.toString().trim());
          }
        }
        
        if (actNums.length === 0) {
          setError('No activity numbers found in the "Ref Number (ACTNUM)" column');
          setIsProcessing(false);
          return;
        }
        
        setActivityNumbers(actNums);
        generateScript(actNums);
        setIsProcessing(false);
      } catch (error) {
        setError('Error processing Excel file: ' + error.message);
        setIsProcessing(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const generateScript = (actNums) => {
    // Arrange activity numbers 7 per row
    const arrangeInRows = (numbers, perRow = 7) => {
      const rows = [];
      for (let i = 0; i < numbers.length; i += perRow) {
        const row = numbers.slice(i, i + perRow).map(num => `'${num}'`).join(',');
        rows.push(row);
      }
      return rows.join(',\n');
    };
    
    const insertValues = arrangeInRows(actNums, 7);
    
    // Generate verification script with all activity numbers (7 per row)
    const verificationActivityNumbers = arrangeInRows(actNums, 7);
    
    const finalScript = `-- Generated FQNP Script
-- Generated on: ${new Date().toLocaleString()}
-- Source File: ${file?.name || 'uploaded_file'}
-- Total Activity Numbers: ${actNums.length}

-- ========================================
-- FQNP EXECUTION SCRIPT
-- ========================================

CREATE TEMP TABLE temp_activity_numbers (activity_number TEXT PRIMARY KEY);

INSERT INTO temp_activity_numbers (activity_number) VALUES
${insertValues};

call FQNP_autocorrection();

-- ========================================
-- VERIFICATION SCRIPT
-- ========================================

-- identify activities to be corrected
select b.*,c.* from prgmemacract a --distinct(b.actrefnum)
join acract b on a.actrefnum=b.actrefnum and a.cmpcod=b.cmpcod 
left outer join acractptratr c on c.actrefnum=b.actrefnum and c.cmpcod=b.cmpcod and c.atrcod='SKELEMENT'
--left outer join acractptratr d on d.actrefnum=c.actrefnum and d.cmpcod=c.cmpcod and d.atrcod='PNRNUM'
where a.cmpcod='QF' and a.prgcod='QFF' and a.actnum in 
(${verificationActivityNumbers});

select * from prgmempnttxn p where cmpcod ='QF' and  pnttyp ='QTSP' and actnum in 
(${verificationActivityNumbers});`;
    
    setGeneratedScript(finalScript);
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
    element.download = `fqnp_script_${new Date().getTime()}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="file-upload-section">
      <div className="upload-area">
        <h4>Upload Excel File</h4>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="file-input"
          id="excel-file"
        />
        <label htmlFor="excel-file" className="file-input-label">
          {file ? file.name : 'Choose Excel File'}
        </label>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {isProcessing && (
          <div className="processing-message">
            <span className="spinner"></span>
            Processing Excel file...
          </div>
        )}
        
        {activityNumbers.length > 0 && (
          <div className="activity-summary">
            <p><strong>Found {activityNumbers.length} activity numbers:</strong></p>
            <div className="activity-preview">
              {activityNumbers.slice(0, 5).map((num, index) => (
                <span key={index} className="activity-chip">{num}</span>
              ))}
              {activityNumbers.length > 5 && (
                <span className="more-indicator">+{activityNumbers.length - 5} more</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {generatedScript && (
        <div className="script-output">
          <div className="script-header">
            <h4>Generated FQNP Script</h4>
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
            rows={15}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;