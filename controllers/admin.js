const { S3Client, PutObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { Genres, Beats, Tags, Licenses } = require("../models/beat");
const { getIO } = require("../config/socket");
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
        const io = getIO();
        io.emit("new_genre", genre);
        return res.json({ message: `${genre.name} created successfully`, data: genre });
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
        return res.json({ message: `${updated_genre.name} updated successfully.`, data: updated_genre });
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
        const deleted = await Genres.findByIdAndDelete({ _id });
        return res.json({ message: `${deleted.name} deleted successfully.` })
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
        return res.json({ message: `${genre.name} created successfully`, data: genre });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const updateTag = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;
    const { name } = req.body;
    try {
        const updated_tag = await Tags.findByIdAndUpdate({ _id }, { name }, { new: true });
        return res.json({ message: `${updated_tag.name} updated successfully`, data: updated_tag });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const deleteTag = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;

    try {
        const deleted = await Tags.findByIdAndDelete({ _id });
        return res.json({ message: `${deleted.name} deleted successfully.` })
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const getTags = async (req, res) => {
    try {

        const tags = await Tags.findOne({});
        return res.json(tags)
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const getTag = async (req, res) => {
    try {
        if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
        const { id: _id } = req.params;
        const tags = await Tags.findOne({ _id });
        return res.json(tags)
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}
// Tag Controller Ends

// License controller starts
const createLicense = async (req, res) => {
    if (!req.body?.name || !req.body?.format || !req.body?.price) return res.status(400).json({ message: "name and price are required!" });
    const { name, description, format, price, territory, state, termsOfYears, distributionCopies, audioStreams } = req.body
    try {
        const license = await Licenses.create({ name, description, format, price, territory, state, termsOfYears, distributionCopies, audioStreams });

        return res.status(201).json({ message: `${license.name} created successfully`, data: license })

    } catch (err) {
        return res.status(400).json({ message: err });
    }
}

const updateLicense = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;
    const { name, description, format, price, territory, state, termsOfYears, distributionCopies, audioStreams } = req.body
    try {
        const updated_license = await Licenses.findByIdAndUpdate({ _id }, { name, description, format, price, territory, state, termsOfYears, distributionCopies, audioStreams }, { new: true });
        return res.json({ message: `${updated_license.name} updated successfully`, data: updated_license });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const deleteLicense = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: "Id is required" })
    const { id: _id } = req.params;
    try {
        const deleted = await Licenses.findByIdAndDelete({ _id });
        return res.json({ message: `${deleted.name} License deleted successfully.` });
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

    if (!req.body?.name || !req.body?.bpm || !req.body?.key) return res.status(400).json({ message: "name, bpm, key are required!" });
    let { name, bpm, key } = req.body;
    try {
        const beatExists = await Beats.findOne({ name });
        if (beatExists) return await res.status(400).json({ message: "Beat name should be unique" })
        const db_genres = await Genres.find({ _id: { $in: req.body?.genre || [] } }).select("name");
        const db_tags = await Tags.find({ _id: { $in: req.body?.tag || [] } });
        const { errors, fileNames } = await uploadFilesToS3(req.files);

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const beat = await Beats.create({ name, bpm, key, files: fileNames, genre: db_genres?.map(item => item?.name), tags: db_tags?.map(item => item?.name) });
        const io = getIO();
        io.emit("new_beat", beat);
        return res.status(201).json({ message: `${beat.name} Uploaded Successfully`, data: beat });


    } catch (err) {
        res.status(400).json({ message: err.message || "Upload failed" });
    }
}

const deleteBeat = async (req, res) => {

    if (!req.params?.id) return res.status(404).json({ message: "beat id is required" });
    const { id: _id } = req.params
    try {
        const { files } = await Beats.findOne({ _id }).select(" -_id");
        const errors = await removeFilesFroms3(files.toObject())
        if (errors.length > 0) return res.status(400).json({ message: "Something went wrong!" });
        let deleted = await Beats.findOneAndDelete({ _id }) //deleting files from DB
        return res.json({ message: `${deleted.name} Deleted Successfully` });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const updateBeat = async (req, res) => {
    if (!req.params?.id) return res.status(404).json({ message: "Beat Id is required!" });
    const { id: _id } = req.params;
    let filenames = {};
    try {
        const { files } = await Beats.findOne({ _id });

        if (Object.keys(req.files).length > 0) {
            let filesToDelete = {}
            Object.entries(req.files).map(([key, data]) => {
                filesToDelete[key] = files[key];
            })
            let { errors, fileNames } = await uploadFilesToS3(req.files);
            let removeErrors = await removeFilesFroms3(filesToDelete);
            filenames = fileNames;

            if (errors.length > 0 || removeErrors.length > 0) {
                return res.status(400).json({ message: "Failed to upload files" });
            }
        }



        const db_genres = await Genres.find({ _id: { $in: req.body?.genre } }).select("name");
        const db_tags = await Tags.find({ _id: { $in: req.body?.tag } }).select("name");

        let updatedData = { ...req.body };

        if (Object.keys(filenames).length > 0) {
            for (const [key, value] of Object.entries(filenames)) {
                updatedData[`files.${key}`] = value;
            }
        }
        if (db_genres) {
            updatedData.genre = db_genres?.map(item => item?.name);
        }

        if (db_tags) {
            updatedData.tags = db_tags?.map(item => item?.name)
        }
        const updatedBeat = await Beats.findByIdAndUpdate({ _id }, { $set: updatedData }, { new: true });
        return res.json({ message: `${updatedBeat.name} updated successfully`, data: updatedBeat });
    } catch (err) {
        return res.status(400).json({ message: err });
    }
}

const getBeats = async (req, res) => {
    try {
        const beats = await Beats.find({});
        return res.json(beats)
    } catch (err) {
        res.status(400).json({ message: err })
    }
}

const getBeat = async (req, res) => {
    try {
        if (!req.params?.id) return res.status(400).json({ message: "Beat id is required!" })
        const { id: _id } = req.params;

        const beat = await Beats.findOne({ _id })
        return res.json(beat)
    } catch (err) {
        res.status(400).json({ message: err })
    }
}

const uploadFilesToS3 = async (files) => {

    let fileNames = {};

    let errors = [];

    let validTypes = {
        mp3: ["audio/mpeg"],
        wav: ["audio/wav", "audio/wave", "audio/x-wav"],
        trackout: ["application/zip", "application/rar", "application/x-rar-compressed", "application/x-zip-compressed"],
        image: ["image/png", "image/jpeg", "image/jpg"]
    }

    try {
        let sentFiles = Object.entries(files).map(([key, data]) => {

            let file = data[0];
            const fileExtension = file.originalname.split(".").pop();
            const fileName = `${Math.floor(Math.random() * 1000000000) + 1}.${fileExtension}`;
            fileNames[key] = fileName;

            if (key == "image" && !validTypes.image.includes(file.mimetype)) {
                errors.push("Only .png, .jpg, .jpeg files are allowed in the image field.");
                return
            }

            if (key == "wav" && !validTypes.wav.includes(file.mimetype)) {
                errors.push("Only .wav files are allowed in the wav field.");
                return
            }

            if (key == "mp3" && !validTypes.mp3.includes(file.mimetype)) {
                errors.push("Only .mp3 files are allowed in the mp3 field.");
                return
            }

            if (key == "trackout" && !validTypes.trackout.includes(file.mimetype)) {
                errors.push("Only .zip or .rar files are allowed in the trackout field.");
                return
            }

            let params = {
                Bucket: process.env.BUCKET_NAME,
                Body: file.buffer,
                Key: fileName,
                ContentType: file.mimetype
            }
            const command = new PutObjectCommand(params);
            s3.send(command);
        });

        await Promise.all(sentFiles)
    } catch (err) {
        errors.push(err);
    }
    return { fileNames, errors };

};

const removeFilesFroms3 = async (files) => {
    let errors = [];

    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Delete: {
                Objects: Object.values(files).map(file => ({ Key: file }))
            }
        }
        let command = new DeleteObjectsCommand(params)
        let results = await s3.send(command);  //deleting files from S3
    } catch (err) {

        errors.push(err)
    }

    return errors
}
module.exports = {
    createGenre,
    updateGenre,
    deleteGenre,
    getGenres,
    createTag,
    updateTag,
    deleteTag,
    getTags,
    getTag,
    createLicense,
    updateLicense,
    deleteLicense,
    getLicenses,
    uploadBeat,
    deleteBeat,
    updateBeat,
    getBeats,
    getBeat
}