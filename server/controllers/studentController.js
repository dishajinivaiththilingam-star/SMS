const supabase = require("../config/supabase");



// ===================================
// ADD STUDENT
// ===================================

exports.addStudent = async (req, res) => {

  try {

    const {
      student_id,
      student_name,
      email,
      phone,
      gender,
      course_id
    } = req.body;

    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          student_id,
          student_name,
          email,
          phone,
          gender,
          course_id
        }
      ])
      .select();

    if (error) {
      return res.status(500).json(error);
    }

    res.status(201).json({
      success: true,
      message: "Student Added Successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// ===================================
// GET ALL STUDENTS
// ===================================

exports.getStudents = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("students")
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




// ===================================
// UPDATE STUDENT
// ===================================

exports.updateStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      student_id,
      student_name,
      email,
      phone,
      gender,
      course_id
    } = req.body;

    const { data, error } = await supabase
      .from("students")
      .update({
        student_id,
        student_name,
        email,
        phone,
        gender,
        course_id
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json(error);
    }

    res.json({
      success: true,
      message: "Student Updated Successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// ===================================
// DELETE STUDENT
// ===================================

exports.deleteStudent = async (req, res) => {

  try {

    const { id } = req.params;

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json(error);
    }

    res.json({
      success: true,
      message: "Student Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};