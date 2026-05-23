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
      return res.status(500).json(error);
    }

    res.status(201).json({
      success: true,
      message: "Attendance Marked Successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
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
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};