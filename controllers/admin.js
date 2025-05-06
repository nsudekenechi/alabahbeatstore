const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Genres, Beats, Tags, Licenses } = require("../models/beat");
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_KEY
    },
    region: process.env.BUCKET_REGION
})

// Genre controller starts
const createGenre = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Genre name is required" })
    try {
        const alreadyExists = await Genres.findOne({ name });
        if (alreadyExists) return res.status(400).json({ message: "Genre already exists!" });
        const genre = await Genres.create({ name });
        return res.json({ message: "Genre created successfully", data: genre });
    } catch (err) {
        res.status(400).json({ message: err })
    }
}

const updateGenre = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updated_genre = await Genres.findByIdAndUpdate({ _id: id }, { name }, { new: true });
        return res.json({ message: "Genre updated successfully.", data: updated_genre });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const deleteGenre = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;

    try {
        const isExisting = await Genres.findOne({ _id });
        if (!isExisting) return res.status(404).json({ message: "Genre doesn't exist" });
        await Genres.findByIdAndDelete({ _id });
        return res.json({ message: "Genre deleted successfully." })
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const getGenres = async (req, res) => {
    try {
        const genres = await Genres.find({});
        return res.json(genres)
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

// Genre controller ends

// Tag Controller Starts 
const createTag = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Tag name is required" })
    try {
        const alreadyExists = await Tags.findOne({ name });
        if (alreadyExists) return res.status(400).json({ message: "Tag already exists!" });
        const genre = await Tags.create({ name });
        return res.json({ message: "Tag created successfully", data: genre });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const updateTag = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;
    const { name } = req.body;
    try {
        const updated_tag = await Tags.findByIdAndUpdate({ _id }, { name });
        return res.json({ message: "Tag updated successfully", data: updated_tag });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const deleteTag = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;

    try {
        await Tags.findByIdAndDelete({ _id });
        return res.json({ message: "Genre deleted successfully." })
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const getTags = async (req, res) => {
    try {
        const tags = await Tags.find({});
        return res.json(tags)
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}
// Tag Controller Ends

// License controller starts
const createLicense = async (req, res) => {
    if (!req.body?.name || !req.body?.format || !req.body?.price) return res.status(400).json({ message: "name, format and price are required!" });
    const { name, description, format, price, territory, state, termsOfYears, distributionCopies, audioStreams } = req.body
    try {
        const license = await Licenses.create({ name, description, format, price, territory, state, termsOfYears, distributionCopies, audioStreams });

        return res.status(201).json({ message: "License created successfully", data: license })

    } catch (err) {
        return res.status(400).json({ message: err });
    }
}

const updateLicense = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;
    try {
        const updated_license = await Licenses.findByIdAndUpdate({ _id }, { ...req.body });
        return res.json({ message: "License updated successfully", data: updated_license });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const deleteLicense = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;
    try {
        await Licenses.findByIdAndDelete({ _id });
        return res.json({ message: "License deleted successfully." });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const getLicenses = async (req, res) => {
    try {
        const licenses = await Licenses.find({});
        return res.json(licenses)
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}
// License controller ends
const uploadBeat = async (req, res) => {
    // checking if files 
    if (!req.files?.mp3 || !req.files?.wav || !req.files?.trackout || !req.files?.image) return res.status(400).json({ message: "mp3, wav, trackout and image fields are required!" });

    if (!req.body?.name || !req.body?.bpm || !req.body?.key) return res.status(400).json({ message: "name, bpm, key, genre are required!" });

    let { mp3, wav, trackout, image } = req.files;
    let { name, bpm, key, genre } = req.body;
    let fileNames = {};
    let errors = [];
    if (mp3[0].mimetype !== "audio/mpeg") {
        errors.push("Only .mp3 files are allowed in the mp3 field.");
    }

    if (wav[0].mimetype !== "audio/wav" && wav[0].mimetype !== "audio/wave" && wav[0].mimetype !== "audio/x-wav") {
        errors.push("Only .wav files are allowed in the wav field.");
    }

    const validTrackoutTypes = [
        "application/zip",
        "application/rar",
        "application/x-rar-compressed",
        "application/x-zip-compressed",
    ];

    if (!validTrackoutTypes.includes(trackout[0].mimetype)) {
        errors.push("Only .zip or .rar files are allowed in the trackout field.");
    }

    const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validImageTypes.includes(image[0].mimetype)) {
        errors.push("Only .png, .jpg, .jpeg files are allowed in the image field.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // uploading mp3, wav, stems and image to s3
        const uploadPromises = Object.entries(req.files).map(([key, data]) => {
            let file = data[0];
            const fileExtension = file.originalname.split(".").pop();
            const fileName = `${Math.floor(Math.random() * 1000000000) + 1}.${fileExtension}`;
            fileNames[key] = fileName;
            let params = {
                Bucket: process.env.BUCKET_NAME,
                Body: file.buffer,
                Key: fileName,
                ContentType: file.mimetype
            }
            const command = new PutObjectCommand(params);
            return s3.send(command);
        });
        await Promise.all(uploadPromises);
        const beat = await Beats.create({ name, bpm, key, genre, files: fileNames });
        res.status(201).json(beat);
    } catch (err) {
        res.status(400).json({ message: err.message || "Upload failed" });
    }
}

module.exports = {
    uploadBeat,
    createGenre,
    updateGenre,
    deleteGenre,
    getGenres,
    createTag,
    updateTag,
    deleteTag,
    getTags,
    createLicense,
    updateLicense,
    deleteLicense,
    getLicenses
}