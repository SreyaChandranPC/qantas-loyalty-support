import React from 'react';
import './App.css';
import ExpandableSection from './components/ExpandableSection';

function App() {
  const sections = {
    fqnp: 'Upload Excel file with activity numbers',
    output: 'Generated scripts with verification',
    srClosure: 'Enter SR number to generate closure script'
  };

  // No backend needed - using static data

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1 className="app-title">Qantas Loyalty Support Management System</h1>
        </header>
        
        <main className="main-content">
          <div className="sections-container">
            <ExpandableSection 
              title="FQNP" 
              content={sections.fqnp}
            />
            <ExpandableSection 
              title="Account Reopen" 
              content={sections.output}
            />
            <ExpandableSection 
              title="SR Closure" 
              content={sections.srClosure}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;