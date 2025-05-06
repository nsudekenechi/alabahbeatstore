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

const Licenses = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // e.g., "Basic", "Premium", "Unlimited"
        },
        description: String, // optional marketing text

        format: {
            type: [String],
            enum: ["mp3", "wav", "trackout"], // What files are delivered with this license
            default: ["mp3"]
        },

        price: {
            type: Number,
            required: true
        },

        territory: {
            type: String,
            default: "Worldwide"
        },

        state: {
            type: String, // e.g., "Non-exclusive", "Exclusive"
            default: "Non-exclusive"
        },

        termsOfYears: {
            type: Number, // e.g., 1 year or 5 years validity
            default: 1
        },

        distributionCopies: {
            type: Number, // Max physical or digital copies allowed
            default: 5000
        },

        audioStreams: {
            type: Number, // Max number of streams
            default: 1000000
        },

        freeDownloads: {
            type: mongoose.Schema.Types.Mixed, // Can be number or "unlimited"
            default: "unlimited",
            validate: {
                validator: function (value) {
                    return typeof value === "number" || value === "unlimited";
                },
                message: "freeDownloads must be a number or 'unlimited'"
            }
        }
    });


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