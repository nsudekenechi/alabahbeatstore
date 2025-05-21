const { Beats, Licenses } = require("../models/beat")

const userGetBeats = async (req, res) => {
    const beats = await Beats.find({});
    const licenses = await Licenses.find({});
    return res.json({ beats, licenses });
}
module.exports = { userGetBeats }