const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and Password are required!" })
    try {
        const alreadyExists = await User.findOne({ email });
        if (alreadyExists) return res.status(400).json({ message: "Email already exists" });
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ email, password: hashPassword, fullname });
        const token = jwt.sign({ user }, process.env.JWT_KEY)
        return res.status(201).json({
            message: "Account created successfully", data: token
        });
    } catch (err) {
        return res.status(400).json({ message: err });
    }
}

const login = async (req, res) => {
    if (!req.body?.email || !req.body?.password) return res.status(400).json({ message: "Email and Password is required!" });
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email or Password is not correct!" });
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) return res.status(400).json({ message: "Email or Password is not correct!" });
        const token = jwt.sign({ user }, process.env.JWT_KEY);
        return res.json({ message: "User Logged in Successfully", data: token });
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}
module.exports = {
    signup,
    login
}