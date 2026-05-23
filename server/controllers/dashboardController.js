const supabase = require("../config/supabase");



exports.getDashboardData = async (req, res) => {

  try {

    // ==========================
    // TOTAL STUDENTS
    // ==========================

    const {
      count: totalStudents
    } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });



    // ==========================
    // TOTAL COURSES
    // ==========================

    const {
      count: totalCourses
    } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });



    // ==========================
    // TOTAL ATTENDANCE
    // ==========================

    const {
      count: totalAttendance
    } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true });



    // ==========================
    // GET FEES DATA
    // ==========================

    const {
      data: feesData
    } = await supabase
      .from("fees")
      .select("*");



    // ==========================
    // TOTAL FEES COLLECTED
    // ==========================

    const totalFeesCollected =
      feesData.reduce(
        (sum, item) =>
          sum + Number(item.paid_amount),
        0
      );



    // ==========================
    // TOTAL PENDING FEES
    // ==========================

    const totalPendingFees =
      feesData.reduce(
        (sum, item) =>
          sum + Number(item.balance_amount),
        0
      );



    // ==========================
    // PAID STUDENTS
    // ==========================

    const paidStudents =
      feesData.filter(
        item =>
          item.payment_status === "Paid"
      ).length;



    res.json({

      totalStudents,

      totalCourses,

      totalAttendance,

      totalFeesCollected,

      totalPendingFees,

      paidStudents

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};