const express = require("express");
const { uploadBeat, createGenre, updateGenre, deleteGenre, getGenres, createTag, getTags, updateTag, deleteTag, createLicense, getLicenses, updateLicense, deleteLicense } = require("../controllers/admin");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage })
router.post("/beat", upload.fields(
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
    ]), uploadBeat);

router.route("/genre").post(createGenre).get(getGenres);
router.route("/genre/:id").patch(updateGenre).delete(deleteGenre);

router.route("/tag").post(createTag).get(getTags);
router.route("/tag/:id").patch(updateTag).delete(deleteTag);

router.route("/license").post(createLicense).get(getLicenses);
router.route("/license/:id").patch(updateLicense).delete(deleteLicense);
module.exports = router