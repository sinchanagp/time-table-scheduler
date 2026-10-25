const express = require("express");

const router = express.Router();

const {
    addTimetable,
    getTimetable,
    deleteTimetable,
    updateTimetable
} = require("../controllers/timetableController");

router.post("/add", addTimetable);
router.get("/", getTimetable);
router.delete("/:id", deleteTimetable);
router.put("/:id", updateTimetable);

module.exports = router;