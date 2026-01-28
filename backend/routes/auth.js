const crypto = require("crypto");
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        });

        await newUser.save();

        res.json({ message: "Signup successful" });

    } catch (err) {
        res.status(500).send("Server error");
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Incorrect password" });

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

   res.json({
    message: "Login successful",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    }
});

});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "User not found" });

        // Generate token
        const token = crypto.randomBytes(20).toString("hex");

        // Save token and expiry
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email (example)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: "your-email@gmail.com",
            subject: "Password Reset",
            text: `Click this link to reset your password: 
http://localhost:5000/auth/reset-password/${token}`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) console.error(err);
        });

        res.json({ message: "Reset link sent to your email" });
    } catch (error) {
        console.error(error);
        res.json({ message: "Error processing request" });
    }
});

// Reset password route
router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // token not expired
        });

        if (!user) return res.json({ message: "Invalid or expired token" });

        const bcrypt = require("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.json({ message: "Error resetting password" });
    }
});


module.exports = router;

