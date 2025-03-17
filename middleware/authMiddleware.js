const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware kiểm tra token hợp lệ
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified; // Lưu thông tin user vào req
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Middleware kiểm tra quyền admin
const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate("role");
        if (!user || !user.role || user.role.name !== "admin") {
            return res.status(403).json({ message: "Access Denied. Admins only." });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { verifyToken, verifyAdmin };
