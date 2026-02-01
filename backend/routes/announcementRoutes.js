const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


/* ADD ANNOUNCEMENT (ADMIN) */
router.post("/add", auth, admin, async (req, res) => {
    try {
        const { title, text } = req.body;

        if (!title || !text) {
            return res.status(400).json({ message: "All fields required" });
        }

        const announcement = new Announcement({ title, text });
        await announcement.save();

        res.json({ message: "Announcement added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* GET ANNOUNCEMENTS (ALL USERS) */
router.get("/", async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 });

        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE ANNOUNCEMENT (ADMIN)
router.delete("/:id", auth, admin, async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: "Announcement deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
