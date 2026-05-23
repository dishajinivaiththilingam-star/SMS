const express =
  require("express");

const router =
  express.Router();

const supabase =
  require("../config/supabase");

const nodemailer =
  require("nodemailer");



// =========================
// NODEMAILER CONFIG
// =========================

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });



// =========================
// GRADE CALCULATOR
// =========================

const getGrade = (obtained, total) => {

  const percentage =
    (obtained / total) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "F";

};



// =========================
// GET ALL MARKS
// =========================

router.get(
  "/",
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("marks")
          .select("*")
          .order("id", {
            ascending: false
          });

      if (error) {

        console.log(error);

        return res.status(500).json({
          message: "Server Error",
          error: error.message
        });

      }

      res.json(data);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);



// =========================
// ADD MARKS
// =========================

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        student_id,
        course_id,
        exam_name,
        total_marks,
        obtained_marks
      } = req.body;



      // =====================
      // STATUS + GRADE
      // =====================

      const percentage =
        (obtained_marks / total_marks) * 100;

      const status =
        percentage >= 50 ? "Pass" : "Fail";

      const grade =
        getGrade(obtained_marks, total_marks);



      // =====================
      // INSERT MARKS
      // =====================

      const { data, error } =
        await supabase
          .from("marks")
          .insert([{
            student_id,
            course_id,
            exam_name,
            total_marks,
            obtained_marks,
            grade,
            status
          }])
          .select();

      if (error) {

        console.log(error);

        return res.status(500).json({
          message: error.message
        });

      }



      // =====================
      // GET STUDENT + COURSE FOR EMAIL
      // =====================

      try {

        const { data: studentData } =
          await supabase
            .from("students")
            .select("student_name, email")
            .eq("id", student_id)
            .single();

        const { data: courseData } =
          await supabase
            .from("courses")
            .select("course_name")
            .eq("id", course_id)
            .single();

        if (
          studentData?.email &&
          process.env.EMAIL_USER &&
          process.env.EMAIL_PASS
        ) {

          await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: studentData.email,

            subject: "Student Marks Report",

            html: `
              <h2>Marks Updated Successfully</h2>
              <p>Hello <b>${studentData.student_name}</b></p>
              <p><b>Course:</b> ${courseData?.course_name || "N/A"}</p>
              <p><b>Exam:</b> ${exam_name}</p>
              <p><b>Marks:</b> ${obtained_marks} / ${total_marks}</p>
              <p><b>Grade:</b> ${grade}</p>
              <p><b>Status:</b> ${status}</p>
              <br>
              <p>Thank You</p>
              <p>SMS Admin</p>
            `,

          });

          console.log("Email Sent Successfully");

        }

      } catch (mailError) {

        console.log("Email error:", mailError.message);
        // Don't fail the request if email fails

      }



      res.status(201).json({
        message: "Marks Added Successfully",
        data
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);



// =========================
// DELETE MARKS
// =========================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      const { error } =
        await supabase
          .from("marks")
          .delete()
          .eq("id", id);

      if (error) {

        console.log(error);

        return res.status(500).json({
          message: "Delete Failed"
        });

      }

      res.json({
        message: "Marks Deleted Successfully"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);

module.exports = router;