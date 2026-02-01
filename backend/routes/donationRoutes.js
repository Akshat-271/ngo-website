const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");      // ✅ JWT check
const admin = require("../middleware/admin");   // ✅ admin check

const Donation = require("../models/Donation");
const User = require("../models/user");


/* ADD DONATION (ADMIN ONLY) */
router.post("/add", auth, admin, async (req, res) => {
    try {
        const { email, amount, note } = req.body;

        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const donation = new Donation({
            userId: user._id,
            amount,
            note
        });

        await donation.save();

        res.json({ message: "Donation added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


/* GET DONATIONS FOR LOGGED USER */
router.get("/my", auth, async (req, res) => {
    try {
        const donations = await Donation.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(donations);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
