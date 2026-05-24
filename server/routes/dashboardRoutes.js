const express = require("express");

const router = express.Router();

const supabase =
  require("../config/supabase");



// =========================
// DASHBOARD DATA
// =========================

router.get("/", async (req, res) => {

  try {

    // =========================
    // TOTAL STUDENTS
    // =========================

    const {
      count: studentsCount
    } = await supabase
      .from("students")
      .select("*", {
        count: "exact",
        head: true
      });



    // =========================
    // TOTAL COURSES
    // =========================

    const {
      count: coursesCount
    } = await supabase
      .from("courses")
      .select("*", {
        count: "exact",
        head: true
      });



    // =========================
    // TOTAL FEES
    // =========================

    const { data: feesData } =
      await supabase
        .from("fees")
        .select("paid_amount");



    let totalFees = 0;

    feesData.forEach((item) => {

      totalFees +=
        Number(item.paid_amount);

    });



    // =========================
    // ATTENDANCE
    // =========================

    const { data: attendance } =
      await supabase
        .from("attendance")
        .select("status");



    const totalAttendance =
      attendance.length;

    const totalPresent =
      attendance.filter(
        (item) =>
          item.status ===
          "Present"
      ).length;



    const attendancePercentage =
      totalAttendance > 0
        ? (
          (totalPresent /
            totalAttendance) *
          100
        ).toFixed(0)
        : 0;



    // =========================
    // RESPONSE
    // =========================

    res.json({

      totalStudents:
        studentsCount,

      totalCourses:
        coursesCount,

      totalFees,

      attendancePercentage

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Dashboard Error"
    });

  }

});

module.exports = router;