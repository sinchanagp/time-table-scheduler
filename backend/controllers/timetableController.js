const Timetable = require("../models/Timetable");

// Add Timetable
const addTimetable = async (req, res) => {

    try {

        const timetable = await Timetable.create(req.body);

        res.status(201).json({
            message: "Class Added Successfully",
            timetable
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Get All Timetable Entries
const getTimetable = async (req, res) => {

    try {

        const timetable = await Timetable.find();

        res.status(200).json(timetable);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Timetable
const deleteTimetable = async (req, res) => {

    try {

        await Timetable.findByIdAndDelete(req.params.id);

        res.json({
            message: "Class Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Timetable
const updateTimetable = async (req, res) => {

    try {

        const updatedTimetable =
            await Timetable.findByIdAndUpdate(
                req.params.id,
                {
                    day: req.body.day,
                    subject: req.body.subject,
                    faculty: req.body.faculty,
                    room: req.body.room,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedTimetable) {

            return res.status(404).json({
                message: "Class not found"
            });

        }

        res.json({
            message: "Class Updated Successfully",
            timetable: updatedTimetable
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addTimetable,
    getTimetable,
    deleteTimetable,
    updateTimetable
};