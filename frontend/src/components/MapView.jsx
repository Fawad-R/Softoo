import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import axios from 'axios';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapDrawControl = ({ onCreate }) => {
  const map = useMap();
  const drawControlRef = useRef(null);

  useEffect(() => {
    if (drawControlRef.current) return;

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: true,
        marker: true,
        rectangle: false,
        circle: false,
        circlemarker: false,
      },
      edit: false,
    });

    drawControlRef.current = drawControl;
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, onCreate);
  }, [map, onCreate]);

  return null;
};

const MapView = () => {
  const [features, setFeatures] = useState([]);

  const fetchGeoJSON = async () => {
    try {
      const res = await axios.get('http://localhost:5000/geojsons');
      setFeatures(res.data);
    } catch (err) {
      console.error('Failed to fetch features', err);
    }
  };

  useEffect(() => {
    fetchGeoJSON();
  }, []);

  const handleCreate = async (e) => {
    const { layer } = e;
    const geojson = layer.toGeoJSON();
    const name = prompt('Enter a name for this feature:');
    if (!name) return;

    try {
      await axios.post('http://localhost:5000/geojsons', {
        name,
        geojson,
      });
      fetchGeoJSON();
    } catch (err) {
      console.error('Failed to save feature', err);
    }
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <MapDrawControl onCreate={handleCreate} />

      {features.map((f) => (
        <GeoJSON
          key={f.id}
          data={f.geojson}
          onEachFeature={(feature, layer) => {
            layer.on('click', () => {
              layer.bindPopup(`
                <strong>${f.name}</strong><br/>
                Created at: ${new Date(f.created_at).toLocaleString()}
              `).openPopup();
            });
          }}
          style={() => ({
            color:
              f.geojson.geometry.type === 'Polygon'
                ? 'green'
                : f.geojson.geometry.type === 'LineString'
                ? 'blue'
                : 'red',
            weight: 3,
          })}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
