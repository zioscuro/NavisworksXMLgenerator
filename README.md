# NavisworksXMLgenerator
A simple generator of Autodesk Navisworks Clash Detection XML files

## Overview
This application is a TypeScript-based web tool built with Vite and Bootstrap. It allows users to quickly define clash test scenarios (Selection Sets) and export them into Autodesk Navisworks-compatible XML files for automated clash detection.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zioscuro/NavisworksXMLgenerator.git
   cd NavisworksXMLgenerator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   This will start the local server, typically available at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The generated static files will be located in the `dist` directory.

## How to Use

### 1. Project Settings & Tolerance
- **Global Tolerance:** Define the clash tolerance in centimeters (cm). This value is synchronized automatically with the LC1 and LC2 tolerances.
- Navisworks internally handles tolerances in decimal feet. The application seamlessly converts your input from **cm to feet** during the XML export.

### 2. Selection Sets
- Add your clash groups using the "Selection Sets" form.
- The app validates inputs to ensure no duplicate or empty names are added.

### 3. Clash LC1 (Self-intersection)
- This mode generates both *duplicate* and *hard* self-intersecting clash tests for each defined Selection Set.
- Only the single Selection Set itself will be placed into 'Selection A'.
- Click **Export LC1 XML** to download the generated file.

### 4. Clash LC2 (Matrix)
- This mode allows you to explicitly define clash interactions between different Selection Sets via a generated Clash Matrix.
- After adding your Selection Sets, click **Generate Clash Matrix**.
- Select the checkboxes corresponding to the pairs you want to test. (The diagonal A vs A is intentionally disabled since self-intersections are handled in LC1).
- Click **Export LC2 XML** to download the generated file.

## Technologies Used
- TypeScript
- Vite
- Bootstrap (via CDN)
