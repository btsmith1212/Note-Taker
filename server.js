const express = require('express');
const fs = require('fs');
const path = require('path');
// set modules for use, path for directory

const app = express();
const allNotes = require('./db/db.json');
const PORT = process.env.PORT || 3001;
// set express to app, allNotes to reference local db file, port to use for local


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// added middleware

app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// get route for homepage

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
// get route for notes page

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// get route that returns index.html

function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}
// function to assign id to notes and send notes to local db

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});
// post to update notes db

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

// function to handle note deletion

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});
// set local port and log to confirm