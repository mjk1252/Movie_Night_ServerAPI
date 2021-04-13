const express = require("express");
const Movie = require("../models/movie");
const moment = require("moment");

const router = express.Router();

router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({
      createdAt: {
        $gte: moment().startOf("week"),
        $lt: moment().endOf("week"),
      },
    });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/movies", async (req, res) => {
  try {
    const movieID = req.body.movieID;
    const votingPerson = req.body.votingPerson;

    const foundMovie = await Movie.findOne({ _id: movieID });

    if (!foundMovie) {
      throw new Error("Server error finding movie");
    }

    if (votingPerson === null) {
      throw new Error("Please Login");
    }

    if (!foundMovie.votes.includes(votingPerson)) {
      await foundMovie.votes.push(votingPerson);
      await foundMovie.save();
    } else if (foundMovie.votes.includes(votingPerson)) {
      await foundMovie.votes.remove({ _id: votingPerson });
      await foundMovie.save();
    }

    res.json(foundMovie._doc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const newMovie = new Movie({
      movieName: req.body.movieName,
      posterURL: req.body.posterURL,
    });

    const savedMovie = await newMovie.save();

    res.json(savedMovie._doc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/book/:id", (req, res) => {
  res.send("book");
});

module.exports = router;
