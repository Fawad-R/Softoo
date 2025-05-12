# 🗺️ Full Stack GeoJSON (React + Node + PostGIS)

---

## 🚀 Features

- 🗺️ Interactive map with drawing controls (Point, Line, Polygon)
- 📝 Name features after drawing
- 📦 Save features to PostgreSQL with PostGIS
- 🔄 Load all saved features on map
- 📍 Popups show name and creation timestamp
- 🎨 Colored features based on geometry type
  - 🔴 Point (red)
  - 🔵 Line (blue)
  - 🟢 Polygon (green)

---

## 🧰 Tech Stack

| Layer    | Tech Used                             |
|----------|----------------------------------------|
| Frontend | React, React Leaflet, Leaflet Draw     |
| Backend  | Node.js, Express, PostgreSQL, PostGIS  |
| Format   | GeoJSON for geometry transfer          |

---

## 📁 Backend
cd backend
npm install

## .env
-DB_USER=your_postgres_username
-DB_PASSWORD=your_postgres_password
-DB_HOST=localhost
-DB_PORT=5432
-DB_NAME=geojson_db

## create Table
- psql -U your_postgres_username -d geojson_db -f create_table.sql

## Run
- node app.js

## 🎨 Frontend Setup
- cd backend
- npm install
- npm start

## 🔄 How It Works (Data Flow)

- User draws a feature (point, line, polygon)
- Prompt asks for feature name
- Feature is converted to GeoJSON and sent to backend
- Backend stores geojson + geometry + name + timestamp
- App fetches all saved features and renders them on map
- Clicking a shape shows a popup with name & created time
