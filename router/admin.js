const express = require("express");
const { uploadBeat, createGenre, updateGenre, deleteGenre, getGenres, createTag, getTags, updateTag, deleteTag, createLicense, getLicenses, updateLicense, deleteLicense, deleteBeat, updateBeat, getBeat, getBeats, getTag } = require("../controllers/admin");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage })
router.route("/beat").post(upload.fields(
    [
        {
            name: "mp3",
            maxCount: 1
        },
        {
            name: "wav",
            maxCount: 1
        },
        {
            name: "trackout",
            maxCount: 1
        },
        {
            name: "image",
            maxCount: 1
        }
    ]), uploadBeat).get(getBeats);
router.route("/beat/:id").delete(deleteBeat).patch(upload.fields(
    [
        {
            name: "mp3",
            maxCount: 1
        },
        {
            name: "wav",
            maxCount: 1
        },
        {
            name: "trackout",
            maxCount: 1
        },
        {
            name: "image",
            maxCount: 1
        }
    ]), updateBeat).get(getBeat);

router.route("/genre").post(createGenre).get(getGenres);
router.route("/genre/:id").patch(updateGenre).delete(deleteGenre).get(getBeat);

router.route("/tag").post(createTag).get(getTags);
router.route("/tag/:id").patch(updateTag).delete(deleteTag).get(getTag);

router.route("/license").post(createLicense).get(getLicenses);
router.route("/license/:id").patch(updateLicense).delete(deleteLicense);
module.exports = router