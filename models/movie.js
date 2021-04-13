const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema(
  {
    movieName: {
      type: String,
      required: true,
    },
    posterURL: {
      type: String,
      required: true,
    },
    votes: [
      {
        type: Schema.Types.ObjectId,
        unique: true,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
