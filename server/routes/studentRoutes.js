const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/upload");
const supabase = require("../config/supabase");
const transporter = require("../config/mail");



// =========================
// ADD STUDENT
// =========================

router.post(
  "/",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        student_id, student_name, email, phone, gender,
        course_id, course_ids,
        nic, dob, occupation, course_type, admission_date,
        permanent_address, current_address, district, home_phone,
        father_name, mother_name, father_phone, mother_phone,
        father_occupation, mother_occupation, monthly_income,
        guardian_name, guardian_phone,
        school_name, education_year, qualification,
        exam_results, other_qualifications,
        agree_discontinue_fee
      } = req.body;

      // Parse course ids
      let parsedCourseIds = [];
      if (course_ids) {
        try { parsedCourseIds = JSON.parse(course_ids); } catch { parsedCourseIds = []; }
      }
      if (parsedCourseIds.length === 0 && course_id) {
        parsedCourseIds = [String(course_id)];
      }

      const primaryCourseId = parsedCourseIds.length > 0
        ? parseInt(parsedCourseIds[0])
        : (course_id ? parseInt(course_id) : null);

      // Encode course_ids into other_qualifications with a marker
      let otherQualificationsValue = other_qualifications || "";
      const COURSE_IDS_MARKER = "||COURSE_IDS:";
      if (otherQualificationsValue.includes(COURSE_IDS_MARKER)) {
        otherQualificationsValue = otherQualificationsValue
          .substring(0, otherQualificationsValue.indexOf(COURSE_IDS_MARKER));
      }
      if (parsedCourseIds.length > 0) {
        otherQualificationsValue = otherQualificationsValue + COURSE_IDS_MARKER + parsedCourseIds.join(",");
      }

      const profile_image = req.file ? req.file.filename : null;

      const { data, error } = await supabase
        .from("students")
        .insert([{
          student_id,
          student_name,
          email,
          phone,
          gender,
          course_id: primaryCourseId,
          nic, dob, occupation, course_type, admission_date,
          permanent_address, current_address, district, home_phone,
          father_name, mother_name, father_phone, mother_phone,
          father_occupation, mother_occupation, monthly_income,
          guardian_name, guardian_phone,
          school_name, education_year, qualification,
          exam_results,
          other_qualifications: otherQualificationsValue,
          agree_discontinue_fee,
          profile_image
        }])
        .select();

      if (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
      }

      // NOTIFICATION
      await supabase.from("notifications").insert([{
        title: "New Student Added",
        message: `${student_name} registered successfully`,
        type: "student"
      }]);

      // EMAIL
      if (email) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Student Management System",
            html: `<h2>Welcome ${student_name}</h2><p>Your registration completed successfully.</p><p><strong>Student ID:</strong> ${student_id}</p><p>Thank You.</p>`
          });
        } catch (mailErr) {
          console.log("Mail error:", mailErr.message);
        }
      }

      res.status(201).json({ success: true, message: "Student Added Successfully", data });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);



// =========================
// HELPER: parse course_ids from other_qualifications
// =========================

const parseCourseIds = (student) => {
  const COURSE_IDS_MARKER = "||COURSE_IDS:";
  const oq = student.other_qualifications || "";
  if (oq.includes(COURSE_IDS_MARKER)) {
    const idx = oq.indexOf(COURSE_IDS_MARKER);
    const idsStr = oq.substring(idx + COURSE_IDS_MARKER.length);
    return idsStr.split(",").map(id => id.trim()).filter(Boolean);
  }
  if (student.course_id) {
    return [String(student.course_id)];
  }
  return [];
};

// Clean other_qualifications for display (remove marker)
const cleanOtherQualifications = (val) => {
  const COURSE_IDS_MARKER = "||COURSE_IDS:";
  if (!val) return "";
  const idx = val.indexOf(COURSE_IDS_MARKER);
  if (idx !== -1) return val.substring(0, idx);
  return val;
};



// =========================
// GET STUDENTS
// =========================

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }

    const students = data.map((student) => ({
      ...student,
      course_ids: parseCourseIds(student),
      other_qualifications: cleanOtherQualifications(student.other_qualifications),
      image_url: student.profile_image
        ? `http://localhost:5000/uploads/${student.profile_image}`
        : null
    }));

    res.json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});



// =========================
// GET SINGLE STUDENT
// =========================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const student = {
      ...data,
      course_ids: parseCourseIds(data),
      other_qualifications: cleanOtherQualifications(data.other_qualifications),
      image_url: data.profile_image
        ? `http://localhost:5000/uploads/${data.profile_image}`
        : null
    };

    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});



// =========================
// UPDATE STUDENT
// =========================

router.put(
  "/:id",
  upload.single("photo"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const { data: oldStudent } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      const {
        student_id, student_name, email, phone, gender,
        course_id, course_ids,
        nic, dob, occupation, course_type, admission_date,
        permanent_address, current_address, district, home_phone,
        father_name, mother_name, father_phone, mother_phone,
        father_occupation, mother_occupation, monthly_income,
        guardian_name, guardian_phone,
        school_name, education_year, qualification,
        exam_results, other_qualifications,
        agree_discontinue_fee
      } = req.body;

      // Parse course ids
      let parsedCourseIds = [];
      if (course_ids) {
        try { parsedCourseIds = JSON.parse(course_ids); } catch { parsedCourseIds = []; }
      }
      if (parsedCourseIds.length === 0 && course_id) {
        parsedCourseIds = [String(course_id)];
      }

      const primaryCourseId = parsedCourseIds.length > 0
        ? parseInt(parsedCourseIds[0])
        : (course_id ? parseInt(course_id) : null);

      // Encode course_ids into other_qualifications
      const COURSE_IDS_MARKER = "||COURSE_IDS:";
      let otherQualificationsValue = other_qualifications || "";
      if (otherQualificationsValue.includes(COURSE_IDS_MARKER)) {
        otherQualificationsValue = otherQualificationsValue
          .substring(0, otherQualificationsValue.indexOf(COURSE_IDS_MARKER));
      }
      if (parsedCourseIds.length > 0) {
        otherQualificationsValue = otherQualificationsValue + COURSE_IDS_MARKER + parsedCourseIds.join(",");
      }

      let updateData = {
        student_id, student_name, email, phone, gender,
        course_id: primaryCourseId,
        nic, dob, occupation, course_type, admission_date,
        permanent_address, current_address, district, home_phone,
        father_name, mother_name, father_phone, mother_phone,
        father_occupation, mother_occupation, monthly_income,
        guardian_name, guardian_phone,
        school_name, education_year, qualification,
        exam_results,
        other_qualifications: otherQualificationsValue,
        agree_discontinue_fee
      };

      // PHOTO UPDATE
      if (req.file) {
        updateData.profile_image = req.file.filename;
        if (oldStudent?.profile_image) {
          const oldPath = path.join(__dirname, "..", "uploads", oldStudent.profile_image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const { data, error } = await supabase
        .from("students")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
      }

      res.json({ success: true, message: "Student Updated Successfully", data });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);



// =========================
// DROPOUT / RESTORE STUDENT
// PUT /api/students/:id/dropout
// Body: { dropout_reason, dropout_date }
// To restore: pass { dropout_reason: null, dropout_date: null }
// =========================

router.put("/:id/dropout", async (req, res) => {
  try {
    const { id } = req.params;
    const { dropout_reason, dropout_date } = req.body;

    const { data, error } = await supabase
      .from("students")
      .update({
        dropout_reason: dropout_reason || null,
        dropout_date: dropout_date || null,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }

    const isRestoring = !dropout_reason && !dropout_date;

    // Add notification
    if (data && data[0]) {
      await supabase.from("notifications").insert([{
        title: isRestoring ? "Student Restored" : "Student Dropout Recorded",
        message: isRestoring
          ? `${data[0].student_name} has been restored as an active student.`
          : `${data[0].student_name} has dropped out. Reason: ${dropout_reason}`,
        type: "student"
      }]);
    }

    res.json({
      success: true,
      message: isRestoring ? "Student Restored Successfully" : "Dropout Recorded Successfully",
      data,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



// =========================
// DELETE STUDENT
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (student?.profile_image) {
      const imagePath = path.join(__dirname, "..", "uploads", student.profile_image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }

    res.json({ success: true, message: "Student Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});



module.exports = router;