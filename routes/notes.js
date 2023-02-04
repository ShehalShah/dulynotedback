const express = require('express');
const router = express.Router()

//importing notes model
const Notes = require('../models/Notes');
//importing middleware
const fetchuser = require('../middleware/fetchuser');

const { body, validationResult } = require('express-validator');


//ROUTE 1:
//get all notes using get "/api/notes/fetchallnotes" login reqd
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send(' error occured')
    }


})

//ROUTE 2:
//get all notes using post "/api/notes/addnote" login reqd
router.post('/addnote', fetchuser, [
    body('title', 'invalid title').isLength({ min: 5 }),
    body('description').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body

        //if errors return bad and err
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savednote = await note.save()

        res.json(savednote)
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('some error occured')
    }

})

//ROUTE 3:
//update exitsting notes using put "/api/notes/updatenote" login reqd
router.put('/updatenote/:id', fetchuser,  async (req, res) => {
    try {
    const { title, description, tag } = req.body
    // create a new note object
    const newNote={}

    //add whichever fields are present to the newnote object(if title is present in request)
    if(title){
        newNote.title=title
    }
    if(description){
        newNote.description=description
    }
    if(tag){
        newNote.tag=tag
    }

    //params.id is note id
    //find the note to be updated
    let note= await Notes.findById(req.params.id)
    if(!note){
        return res.status(404).send("not found ")
    }

    //check the user trying to update
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("not allowed ")
    }

    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json(note)
}
    catch (error) {
        console.log(error.message);
        res.status(500).send('some error occured')
    }
})

//ROUTE 4:
//delete exitsting notes using delete "/api/notes/deletenote" login reqd
router.delete('/deletenote/:id', fetchuser,  async (req, res) => {
    try {
    //params.id is note id
    //find the note to be deleted
    let note= await Notes.findById(req.params.id)
    if(!note){
        return res.status(404).send("not found ")
    }
    const notetitle=note.title;

    //check the user trying to delete
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("not allowed ")
    }

    note=await Notes.findByIdAndDelete(req.params.id)
    res.send(notetitle + "note deleted successfully")
}
catch (error) {
    console.log(error.message);
    res.status(500).send('some error occured')
}
})
module.exports = router