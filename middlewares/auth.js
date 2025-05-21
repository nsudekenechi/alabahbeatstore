const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) return res.status(400).json({ message: "An authorization token is required" });
        const token = authorization.split(" ")[1];
        const { user } = jwt.verify(token, process.env.JWT_KEY);
        console.log(user)
        req.user = user
        next();
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

const authorizeAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next(); // user is admin, proceed
        } else {
            return res.status(403).json({ message: "Forbidden: Admins only." });
        }
    } catch (err) {
        return res.status(400).json({ message: err })
    }
}

module.exports = { authenticate, authorizeAdmin }