const express = require('express');
const app = express();



const fs = require('fs');
const path = require('path');


app.get('/', (req, res) => {
    console.log("Here")
    res.send("Hi")
  });

  app.listen(3000)

// Middleware for JSON parsing
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API routes
const dbPath = path.join(__dirname, 'db.json');

// Read notes from db.json
app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Save new note to db.json
app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  // Read existing notes from db.json
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const notes = JSON.parse(data);

    // Assign a unique id to the new note
    newNote.id = Date.now().toString();

    // Add the new note to the existing notes
    notes.push(newNote);

    // Write the updated notes back to db.json
    fs.writeFile(dbPath, JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(newNote);
    });
  });
});

// HTML routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});