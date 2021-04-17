const express = require("express");
const Movie = require("../models/movie");
const moment = require("moment");
const router = express.Router();

router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({
      createdAt: {
        $gte: moment().startOf("week"),
        $lte: moment().endOf("week"),
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
      foundMovie.vote_count++;
      await foundMovie.save();
      res.json(foundMovie._doc);
      return;
    } else if (foundMovie.votes.includes(votingPerson)) {
      await foundMovie.votes.remove({ _id: votingPerson });
      foundMovie.vote_count--;
      await foundMovie.save();
      res.json(foundMovie._doc);
      return;
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const foundMovie = await Movie.findOne({ movieName: req.body.movieName });

    if (foundMovie) {
      if (
        foundMovie._doc.createdAt < moment().subtract(1, "week").startOf("week")
      ) {
        foundMovie.remove();

        const newMovie = new Movie({
          movieName: req.body.movieName,
          posterURL: req.body.posterURL,
        });

        const savedMovie = await newMovie.save();
        res.json(savedMovie._doc);
        return;
      } else if (
        foundMovie._doc.createdAt > moment().subtract(1, "week").startOf("week")
      ) {
        res.json(foundMovie._doc);
        return;
      }
    }

    const newMovie = new Movie({
      movieName: req.body.movieName,
      posterURL: req.body.posterURL,
    });

    const newMovieResult = await newMovie.save();

    res.json(newMovieResult._doc);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/book", async (req, res) => {
  try {
    const movie = await Movie.find({
      createdAt: {
        $gte: moment().subtract(1, "week").startOf("week"),
        $lte: moment().subtract(1, "week").endOf("week"),
      },
    })
      .sort({ vote_count: -1 })
      .limit(1)
      .populate("bookings");

    res.json(movie);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/book", async (req, res) => {
  try {
    const movieID = req.body.movieID;
    const bookingPerson = req.body.bookingPerson;

    const foundMovie = await Movie.findOne({ _id: movieID });

    if (!foundMovie) {
      throw new Error("Server error finding movie");
    }

    if (bookingPerson === null) {
      throw new Error("Please Login");
    }

    if (!foundMovie.bookings.includes(bookingPerson)) {
      await foundMovie.bookings.push(bookingPerson);
      await foundMovie.save();
      res.json(foundMovie._doc);
      return;
    } else if (foundMovie.bookings.includes(bookingPerson)) {
      await foundMovie.bookings.remove({ _id: bookingPerson });
      await foundMovie.save();
      res.json(foundMovie._doc);
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
