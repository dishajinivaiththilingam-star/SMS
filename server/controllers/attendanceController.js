const supabase = require("../config/supabase");



// =======================================
// MARK ATTENDANCE
// =======================================

exports.markAttendance = async (req, res) => {

  try {

    const attendanceData = req.body;

    const { data, error } = await supabase
      .from("attendance")
      .insert(attendanceData)
      .select();

    if (error) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

    res.status(201).json({

      success: true,

      message: "Attendance Marked Successfully",

      data

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};




// =======================================
// GET ALL ATTENDANCE
// =======================================

exports.getAttendance = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .order("attendance_date", {
        ascending: false
      });

    if (error) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

    res.json(data);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};