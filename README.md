# Qantas Loyalty Support Management System

A React.js web application for processing Excel files with activity numbers and generating FQNP scripts.

## Project Structure

```
loysupapp/
├── frontend/          # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpandableSection.js
│   │   │   ├── FileUploadSection.js
│   │   │   └── *.css
│   │   ├── App.js
│   │   └── ...
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 16+ and npm

## Getting Started

1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm start
   ```

   The application will start on `http://localhost:3000`

## Features

- **FQNP Script Generation**: Upload Excel files and generate FQNP scripts
- **Excel File Processing**: Reads "Ref Number (ACTNUM)" column automatically
- **Script Templates**: Generates ready-to-execute database scripts
- **Copy & Download**: Easy script extraction and file download
- **Responsive Design**: Modern, mobile-friendly interface with pastel colors
- **File Validation**: Validates Excel file types and column presence

## How to Use

1. **Open Application**: Navigate to `http://localhost:3000`
2. **Click FQNP Section**: Expand the FQNP section
3. **Upload Excel File**: Choose an Excel file (.xlsx or .xls) with "Ref Number (ACTNUM)" column
4. **Review Activity Numbers**: See preview of found activity numbers
5. **Generate Script**: Automatic script generation with your template
6. **Copy or Download**: Use the generated script in your server environment

## Script Output Format

The application generates scripts in this format:
```sql
CREATE TEMP TABLE temp_activity_numbers (activity_number TEXT PRIMARY KEY);

INSERT INTO temp_activity_numbers (activity_number) VALUES
('ACT797040893'),('ACT797040895'),('ACT795312947');

call FQNP_autocorrection();
```

## Technology Stack

- React 18
- XLSX library for Excel processing
- Modern CSS with pastel color theme
- Responsive design

## License

This project is proprietary to Qantas Airways Limited.