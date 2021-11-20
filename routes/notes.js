const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

const fetchUser = require("../middleware/fetchUser");

// ROUTE 1: fetch all notes by a user - GET "/api/notes/fetchAllNotes"
router.get("/fetchAllNotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// ROUTE 2: Add a note by a user - POST "/api/notes/addnote"
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title must contain atleast 1 character").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    // check for invalid note details
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server error" });
    }
  }
);

// ROUTE 3: Update a note by a user - PUT "/api/notes/:id"
router.put(
  "/:id",
  fetchUser,
  [
    body("title", "Title must contain atleast 1 character").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    // check for invalid note details
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const newNote = { title, description, tag };
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(400).json({ error: "Note not found" });
      }
      if (note.user.toString() != req.user.id) {
        return res.status(401).json({ error: "Access denied" });
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

// ROUTE 4: Delete a note by a user - DELETE "/api/notes/:id"
router.delete("/:id", fetchUser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ error: "Note not found" });
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).json({ error: "Access denied" });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ succes: "Note was successfully deleted!", note });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
