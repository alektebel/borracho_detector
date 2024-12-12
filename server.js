const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML form as static content
app.use(express.static('public'));

// Set up SQLite database
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Error opening database: ' + err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create the "datos" table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS datos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hora_consumicion TEXT,
    edad INTEGER,
    peso REAL,
    altura REAL,
    sexo TEXT,
    frecuencia_bebida TEXT,
    copa_ron INTEGER,
    copa_ginebra INTEGER,
    cerveza REAL,
    tercio_licor INTEGER,
    hora_ultima_comida TEXT
  )`);
});

// Handle form submission
app.post('/submit', (req, res) => {
  const {
    hora_consumicion,
    edad,
    peso,
    altura,
    sexo,
    frecuencia_bebida,
    copa_ron,
    copa_ginebra,
    cerveza,
    tercio_licor,
    hora_ultima_comida
  } = req.body;

  // Insert form data into the database
  const query = `INSERT INTO datos (hora_consumicion, edad, peso, altura, sexo, frecuencia_bebida, copa_ron, copa_ginebra, cerveza, tercio_licor, hora_ultima_comida)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(query, [
    hora_consumicion,
    edad,
    peso,
    altura,
    sexo,
    frecuencia_bebida,
    copa_ron || 0,
    copa_ginebra || 0,
    cerveza || 0,
    tercio_licor || 0,
    hora_ultima_comida
  ], function(err) {
    if (err) {
      console.error('Error inserting data: ' + err.message);
      res.status(500).send('Error inserting data into the database');
    } else {
      console.log('Data inserted successfully');
      res.redirect('/');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
