import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const app = express();
const PORT = 3000;
const NOTES_FILE = path.join(path.resolve(), 'data', 'notes.json');

// Helper functions
function saveNotes(notes) {
  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
}

function loadNotes() {
  try {
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'frontend')));

// Routes
app.get('/', (req, res) => {
  res.send('Carrier online. Systems nominal.');
});

// Save a new note
app.post('/save', (req, res) => {
  const { note, topic } = req.body;

  if (!note || !topic) {
    return res.status(400).json({ error: 'Both "note" and "topic" are required.' });
  }

  try {
    const notes = loadNotes();
    const newNote = {
      id: uuidv4(),
      topic,
      note,
      timestamp: new Date(),
      pin: false,
    };
    notes.push(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error saving new note:', error);
    res.status(500).json({ error: 'Failed to save note.' });
  }
});



// Get all notes
app.get('/notes', (req, res) => {
  fs.readFile(NOTES_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes file:', err);
      return res.status(500).send('Server error.');
    }
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  let notes = loadNotes();

  const initialLength = notes.length;
  const updatedNotes = notes.filter(note => note.id !== idToDelete);

  if (updatedNotes.length === initialLength) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  saveNotes(updatedNotes);
  res.status(200).json({ message: 'Note deleted successfully.' });
});

// Update a note
app.put('/notes/:id', (req, res) => {
  const idToUpdate = req.params.id;
  const { topic, note } = req.body;

  let notes = loadNotes();
  const noteIndex = notes.findIndex(n => n.id === idToUpdate);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  notes[noteIndex].topic = topic;
  notes[noteIndex].note = note;
  notes[noteIndex].timestamp = new Date();
  saveNotes(notes);

  res.status(200).json({ message: 'Note updated successfully.' });
});

// Toggle pin/unpin
app.put('/togglePin/:id', (req, res) => {
  const idToToggle = req.params.id;
  const notes = loadNotes();
  const noteIndex = notes.findIndex(n => n.id === idToToggle);

  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  notes[noteIndex].pin = !notes[noteIndex].pin;
  saveNotes(notes);

  res.status(200).json({ message: 'Pin status updated.' });
});

// Start the server
app.listen(PORT, 'localhost', () => {
  console.log(`Carrier is deployed and listening at http://localhost:${PORT}`);
});
