const router =
  require("express").Router();

const fs =
  require("fs");

const path =
  require("path");

const upload =
  require("../middleware/upload");

const supabase =
  require("../config/supabase");

const transporter =
  require("../config/mail");



// =========================
// ADD STUDENT
// =========================

router.post(
  "/",
  upload.single("photo"),
  async (req, res) => {

    try {

      const {

        student_id,
        student_name,
        email,
        phone,
        gender,
        course_id,

        nic,
        dob,
        occupation,
        course_type,
        admission_date,

        permanent_address,
        current_address,
        district,
        home_phone,

        father_name,
        mother_name,
        father_phone,
        mother_phone,
        father_occupation,
        mother_occupation,
        monthly_income,
        guardian_name,
        guardian_phone,

        school_name,
        education_year,
        qualification,
        exam_results,
        other_qualifications,

        agree_discontinue_fee

      } = req.body;



      // =========================
      // PHOTO
      // =========================

      const profile_image =
        req.file
          ? req.file.filename
          : null;



      // =========================
      // INSERT STUDENT
      // =========================

      const { data, error } =
        await supabase
          .from("students")
          .insert([{

            student_id,
            student_name,
            email,
            phone,
            gender,
            course_id,

            nic,
            dob,
            occupation,
            course_type,
            admission_date,

            permanent_address,
            current_address,
            district,
            home_phone,

            father_name,
            mother_name,
            father_phone,
            mother_phone,
            father_occupation,
            mother_occupation,
            monthly_income,
            guardian_name,
            guardian_phone,

            school_name,
            education_year,
            qualification,
            exam_results,
            other_qualifications,

            agree_discontinue_fee,

            profile_image

          }])
          .select();



      if (error) {

        console.log(error);

        return res.status(400).json({
          message: error.message
        });

      }



      // =========================
      // ADD NOTIFICATION
      // =========================

      await supabase
        .from("notifications")
        .insert([{

          title:
            "New Student Added",

          message:
            `${student_name} registered successfully`,

          type:
            "student"

        }]);



      // =========================
      // SEND EMAIL
      // =========================

      if (email) {

        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to:
            email,

          subject:
            "Welcome to Student Management System",

          html: `

            <h2>
              Welcome ${student_name}
            </h2>

            <p>
              Your registration completed successfully.
            </p>

            <p>
              <strong>Student ID:</strong>
              ${student_id}
            </p>

            <p>
              <strong>Course Type:</strong>
              ${course_type}
            </p>

            <p>
              Thank You.
            </p>

          `

        });

      }



      // =========================
      // RESPONSE
      // =========================

      res.status(201).json({

        success: true,

        message:
          "Student Added Successfully",

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

  }
);



// =========================
// GET STUDENTS
// =========================

router.get(
  "/",
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("students")
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



      const students =
        data.map((student) => ({

          ...student,

          image_url:
            student.profile_image
              ? `http://localhost:5000/uploads/${student.profile_image}`
              : null

        }));



      res.json(students);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);



// =========================
// GET SINGLE STUDENT
// =========================

router.get(
  "/:id",
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const { data, error } =
        await supabase
          .from("students")
          .select("*")
          .eq("id", id)
          .single();



      if (error) {

        return res.status(400).json({
          message: error.message
        });

      }



      const student = {

        ...data,

        image_url:
          data.profile_image
            ? `http://localhost:5000/uploads/${data.profile_image}`
            : null

      };



      res.json(student);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error"
      });

    }

  }
);



// =========================
// UPDATE STUDENT
// =========================

router.put(
  "/:id",
  upload.single("photo"),
  async (req, res) => {

    try {

      const { id } =
        req.params;



      // =========================
      // GET OLD STUDENT
      // =========================

      const { data: oldStudent } =
        await supabase
          .from("students")
          .select("*")
          .eq("id", id)
          .single();



      const {

        student_id,
        student_name,
        email,
        phone,
        gender,
        course_id,

        nic,
        dob,
        occupation,
        course_type,
        admission_date,

        permanent_address,
        current_address,
        district,
        home_phone,

        father_name,
        mother_name,
        father_phone,
        mother_phone,
        father_occupation,
        mother_occupation,
        monthly_income,
        guardian_name,
        guardian_phone,

        school_name,
        education_year,
        qualification,
        exam_results,
        other_qualifications,

        agree_discontinue_fee

      } = req.body;



      let updateData = {

        student_id,
        student_name,
        email,
        phone,
        gender,
        course_id,

        nic,
        dob,
        occupation,
        course_type,
        admission_date,

        permanent_address,
        current_address,
        district,
        home_phone,

        father_name,
        mother_name,
        father_phone,
        mother_phone,
        father_occupation,
        mother_occupation,
        monthly_income,
        guardian_name,
        guardian_phone,

        school_name,
        education_year,
        qualification,
        exam_results,
        other_qualifications,

        agree_discontinue_fee

      };



      // =========================
      // PHOTO UPDATE
      // =========================

      if (req.file) {

        updateData.profile_image =
          req.file.filename;



        // DELETE OLD PHOTO

        if (oldStudent?.profile_image) {

          const oldPath =
            path.join(
              __dirname,
              "..",
              "uploads",
              oldStudent.profile_image
            );



          if (fs.existsSync(oldPath)) {

            fs.unlinkSync(oldPath);

          }

        }

      }



      // =========================
      // UPDATE QUERY
      // =========================

      const { data, error } =
        await supabase
          .from("students")
          .update(updateData)
          .eq("id", id)
          .select();



      if (error) {

        console.log(error);

        return res.status(400).json({
          message: error.message
        });

      }



      // =========================
      // RESPONSE
      // =========================

      res.json({

        success: true,

        message:
          "Student Updated Successfully",

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

  }
);



// =========================
// DELETE STUDENT
// =========================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const { data: student } =
        await supabase
          .from("students")
          .select("*")
          .eq("id", id)
          .single();



      // =========================
      // DELETE IMAGE
      // =========================

      if (student?.profile_image) {

        const imagePath =
          path.join(
            __dirname,
            "..",
            "uploads",
            student.profile_image
          );



        if (fs.existsSync(imagePath)) {

          fs.unlinkSync(imagePath);

        }

      }



      // =========================
      // DELETE QUERY
      // =========================

      const { error } =
        await supabase
          .from("students")
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
          "Student Deleted Successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  }
);



// =========================
// EXPORT
// =========================

module.exports = router;