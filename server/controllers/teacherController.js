const supabase =
  require("../config/supabase");



// =========================
// ADD TEACHER
// =========================

const addTeacher =
  async (req, res) => {

    try {

      let {

        teacher_name,
        email,
        phone,
        subject,
        courses,
        qualification,
        experience,
        salary,
        joining_date,
        gender,
        address,
        status

      } = req.body;



      // PROFILE IMAGE

      const profile_image =
        req.file
          ? req.file.filename
          : null;



      // COURSES FIX

      let courseList = "";



      if (
        typeof courses === "string"
      ) {

        try {

          const parsedCourses =
            JSON.parse(courses);

          if (
            Array.isArray(parsedCourses)
          ) {

            courseList =
              parsedCourses.join(",");

          }

          else {

            courseList =
              courses;

          }

        } catch {

          courseList =
            courses;

        }

      }

      else if (
        Array.isArray(courses)
      ) {

        courseList =
          courses.join(",");

      }

      else {

        courseList = "";

      }



      // INSERT

      const { data, error } =
        await supabase
          .from("teachers")
          .insert([{

            teacher_name,
            email,
            phone,
            subject,
            qualification,
            experience,
            salary,
            joining_date,
            gender,
            address,
            status,

            courses:
              courseList,

            profile_image

          }])
          .select();



      if (error) {

        return res.status(400).json({
          message: error.message
        });

      }



      res.status(201).json({

        success: true,

        message:
          "Teacher Added Successfully",

        data

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  };



// =========================
// GET TEACHERS
// =========================

const getTeachers =
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("teachers")
          .select("*")
          .order("id", {
            ascending: false
          });



      if (error) {

        return res.status(400).json({
          message: error.message
        });

      }



      const teachers =
        data.map((teacher) => ({

          ...teacher,

          image_url:
            teacher.profile_image
              ? `http://localhost:5000/uploads/${teacher.profile_image}`
              : null

        }));



      res.json(teachers);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  };



// =========================
// UPDATE TEACHER
// =========================

const updateTeacher =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      let {

        teacher_name,
        email,
        phone,
        subject,
        courses,
        qualification,
        experience,
        salary,
        joining_date,
        gender,
        address,
        status

      } = req.body;



      // COURSES FIX

      let courseList = "";



      if (
        typeof courses === "string"
      ) {

        try {

          const parsedCourses =
            JSON.parse(courses);

          if (
            Array.isArray(parsedCourses)
          ) {

            courseList =
              parsedCourses.join(",");

          }

          else {

            courseList =
              courses;

          }

        } catch {

          courseList =
            courses;

        }

      }

      else if (
        Array.isArray(courses)
      ) {

        courseList =
          courses.join(",");

      }

      else {

        courseList = "";

      }



      // UPDATE DATA

      let updateData = {

        teacher_name,
        email,
        phone,
        subject,
        qualification,
        experience,
        salary,
        joining_date,
        gender,
        address,
        status,

        courses:
          courseList

      };



      // IMAGE UPDATE

      if (req.file) {

        updateData.profile_image =
          req.file.filename;

      }



      // UPDATE QUERY

      const { data, error } =
        await supabase
          .from("teachers")
          .update(updateData)
          .eq("id", id)
          .select();



      if (error) {

        return res.status(400).json({
          message: error.message
        });

      }



      res.json({

        success: true,

        message:
          "Teacher Updated Successfully",

        data

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  };



// =========================
// DELETE TEACHER
// =========================

const deleteTeacher =
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const { error } =
        await supabase
          .from("teachers")
          .delete()
          .eq("id", id);



      if (error) {

        return res.status(400).json({
          message: error.message
        });

      }



      res.json({

        success: true,

        message:
          "Teacher Deleted Successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  };



module.exports = {

  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher

};