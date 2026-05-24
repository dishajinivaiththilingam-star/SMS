const router = require("express").Router();

const {
  markAttendance,
  getAttendance
} = require("../controllers/attendanceController");



// MARK ATTENDANCE
router.post("/", markAttendance);



// GET ATTENDANCE
router.get("/", getAttendance);



module.exports = router;