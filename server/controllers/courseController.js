const supabase =
  require("../config/supabase");



// =========================
// ADD COURSE
// =========================

const addCourse =
  async (req, res) => {

    try {

      const {
        course_name,
        teacher_name,
        duration,
        course_fee
      } = req.body;



      const { data, error } =
        await supabase
          .from("courses")
          .insert([{

            course_name,
            teacher_name,
            duration,
            course_fee

          }])
          .select();



      if (error) {

        console.log(error);

        return res.status(400).json({
          message: error.message
        });

      }



      res.status(201).json({

        success: true,

        message:
          "Course Added Successfully",

        data

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  };



// =========================
// GET COURSES
// =========================

const getCourses =
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("courses")
          .select("*")
          .order("id", {
            ascending: false
          });



      if (error) {

        console.log(error);

        return res.status(400).json({
          message: error.message
        });

      }



      res.json(data);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  };



// =========================
// UPDATE COURSE
// =========================

const updateCourse =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const {
        course_name,
        teacher_name,
        duration,
        course_fee
      } = req.body;



      const { data, error } =
        await supabase
          .from("courses")
          .update({

            course_name,
            teacher_name,
            duration,
            course_fee

          })
          .eq("id", id)
          .select();



      if (error) {

        console.log(error);

        return res.status(400).json({
          message: error.message
        });

      }



      res.json({

        success: true,

        message:
          "Course Updated Successfully",

        data

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  };



// =========================
// DELETE COURSE
// =========================

const deleteCourse =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const { error } =
        await supabase
          .from("courses")
          .delete()
          .eq("id", id);



      if (error) {

        console.log(error);

        return res.status(400).json({
          message: error.message
        });

      }



      res.json({

        success: true,

        message:
          "Course Deleted Successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  };



// =========================
// EXPORT
// =========================

module.exports = {

  addCourse,
  getCourses,
  updateCourse,
  deleteCourse

};