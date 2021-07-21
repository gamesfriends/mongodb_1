const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res) => {
    const { title, description } = req.body;
    const errors = [];

    if (!title) {
        errors.push({text: 'Please a write a Title'});
    }

    if (!description) {
        errors.push({text: 'Please a write a Description'})
    }

    if (errors.length > 0) {
        res.render('notes/new-note', { errors, title, description });
    } else {
        const newNote = new Note({title, description});
        await newNote.save();
        res.redirect('/notes');
    }
});

router.get('/notes', async (req, res) => {
    //const notes = await Note.find();
    //res.render('notes/all-notes', { notes });
    await Note.find().sort({date: 'desc'})
    .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
                return {
                    id: documento._id,
                    title: documento.title,
                    description: documento.description
                }
            })
        }
        res.render('notes/all-notes', { notes: contexto.notes });
    })
});

router.get('/notes/edit/:id', async (req, res) => {
    const note = await Note.findById(req.params.id)
    .then(data =>{
        return {
            title:data.title,
            description:data.description,
            id:data.id
        }
    })
    res.render('notes/edit-note',{note})
});

router.put('/notes/edit-note/:id', async (req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes');
});

module.exports = router;
