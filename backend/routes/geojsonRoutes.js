const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

router.get('/geojsons', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM geojson_data ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching geojsons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/geojsons', async (req, res) => {
  const { name, geojson } = req.body;
  try {
    const id = uuidv4();
    const geometry = JSON.stringify(geojson.geometry);
    const query = `
      INSERT INTO geojson_data (id, name, geojson, geometry)
      VALUES ($1, $2, $3, ST_SetSRID(ST_GeomFromGeoJSON($4), 4326))
      RETURNING *;
    `;
    const values = [id, name, geojson, geometry];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving geojson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;