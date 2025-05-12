const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const geojsonRoutes = require('./routes/geojsonRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   // credentials: true,
// }));
app.use(bodyParser.json());

app.use('/', geojsonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});