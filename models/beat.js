const mongoose = require("mongoose");
const Tags = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);

const Genres = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Licenses = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    format: {
        type: [String],
        enum: ["mp3", "wav", "trackout"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    territory: String,
    state: String,
    termsOfYears: Number,
    distributionCopies: Number,
    audioStreams: Number,
    // freeDownloads: Number | String,

})

const Beats = mongoose.Schema({
    name: {
        required: true,
        unique: true,
        type: String
    },
    bpm: {
        type: String,
        min: 40,
        max: 250,
        required: true
    },
    key: {
        type: String,
        enum: [
            "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
            "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
        ],
        default: "C"
    },
    genre: {
        type: [String],
        required: true
    },

    tags: {
        type: [String],
        required: true
    },
    plays: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    files: {
        type: {
            image: String,
            mp3: String,
            wav: String,
            trackout: String
        },
        required: true
    }
})

module.exports = {
    Licenses: mongoose.model("licenses", Licenses),
    Tags: mongoose.model("tags", Tags),
    Genres: mongoose.model("genres", Genres),
    Beats: mongoose.model("beats", Beats)
}