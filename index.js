require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note');

// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true,
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false,
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true,
//   },
// ];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static('dist'));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const generatedId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

app.get('/', (req, res) => {
  res.send('<h1>Hello World...!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    res.json(note);
  });
});

app.post('/api/notes', (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(404).json({ error: 'content missing' });
  }
  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
