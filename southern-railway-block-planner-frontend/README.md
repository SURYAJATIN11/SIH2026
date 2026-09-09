# Southern Railway AI Block Planner — Frontend

A frontend prototype for **AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations**.

## Run
1. Install Node.js.
2. Open this folder in a terminal.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL shown by Vite.

## Backend integration
Open **System Integration** in the application and enter the FastAPI base URL, for example:
`http://localhost:8000`

The app uses a centralized API client in `src/api.js`.

The current UI intentionally contains **no fabricated operational records**. Data is loaded only when the corresponding backend endpoint is connected.

## Included frontend coverage
- Dashboard and railway network visualization
- Stations, corridors and track sections
- Assets, maintenance and defects
- Trains and train movements
- Goods forecasts
- Candidate block generation
- Block windows and plans
- Conflict detection and asset availability
- Weather and incidents
- Emergency replanning
- AI/ML and optimization interface placeholders
- Reports, analytics and plan versions
- Backend integration and health testing

This is a prototype UI and must not be represented as an official Indian Railways control system.
