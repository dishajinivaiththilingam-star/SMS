import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);

  // =========================
  // GET STUDENT
  // =========================

  const getStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/${id}`);
      setStudent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // GET COURSES
  // =========================

  const getCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data.data || res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // GET COURSE NAMES
  // =========================

  const getCourseNames = () => {
    if (!student) return [];

    let ids = [];

    if (student.course_ids && Array.isArray(student.course_ids)) {
      ids = student.course_ids;
    } else if (typeof student.course_ids === "string") {
      try {
        ids = JSON.parse(student.course_ids);
      } catch {
        ids = [];
      }
    } else if (student.course_id) {
      ids = [student.course_id];
    }

    return ids
      .map((cid) => courses.find((c) => String(c.id) === String(cid))?.course_name)
      .filter(Boolean);
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Student will be deleted permanently. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Student Deleted Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/students-list");
      } catch (error) {
        console.log(error);
        Swal.fire({ icon: "error", title: "Error", text: "Delete Failed" });
      }
    }
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const handleEdit = () => {
    navigate(`/students/edit/${id}`);
  };

  // =========================
  // LOAD
  // =========================

  useEffect(() => {
    getStudent();
    getCourses();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (!student) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-[250px] w-full min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading student...</p>
          </div>
        </div>
      </div>
    );
  }

  const courseNames = getCourseNames();

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-10">

          {/* ── BACK BUTTON ── */}
          <button
            onClick={() => navigate("/students-list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition font-medium"
          >
            <ArrowLeft size={18} />
            Back to Students List
          </button>

          {/* ── PROFILE HEADER CARD ── */}
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <div className="flex justify-between items-start">

              <div className="flex items-center gap-8">
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={
                      student.image_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.student_name
                      )}&background=3b82f6&color=fff&size=200`
                    }
                    alt="Student"
                    className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.student_name
                      )}&background=3b82f6&color=fff&size=200`;
                    }}
                  />
                  {/* Gender badge */}
                  {student.gender && (
                    <span
                      className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        student.gender === "Male"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {student.gender}
                    </span>
                  )}
                </div>

                {/* BASIC INFO */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {student.student_name}
                  </h1>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {student.student_id}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-1">
                    📧 {student.email || "—"}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    📱 {student.phone || "—"}
                  </p>

                  {/* COURSES */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {courseNames.length > 0 ? (
                      courseNames.map((course, index) => (
                        <span
                          key={index}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          🎓 {course}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No Courses Assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow"
                >
                  <Pencil size={16} />
                  Edit Student
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow"
                >
                  <Trash2 size={16} />
                  Delete Student
                </button>
              </div>

            </div>
          </div>

          {/* ── PERSONAL DETAILS ── */}
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h2 className="text-lg font-bold text-blue-700 mb-5 pb-2 border-b border-blue-100">
              🧑 Personal Details
            </h2>
            <div className="grid grid-cols-3 gap-5">
              <Detail label="Student Name" value={student.student_name} />
              <Detail label="Email Address" value={student.email} />
              <Detail label="Phone Number" value={student.phone} />
              <Detail label="NIC Number" value={student.nic} />
              <Detail label="Gender" value={student.gender} />
              <Detail label="Date of Birth" value={student.dob} />
              <Detail label="Occupation" value={student.occupation} />
              <Detail label="Course Type" value={student.course_type} />
              <Detail label="Admission Date" value={student.admission_date} />
            </div>
          </div>

          {/* ── CONTACT DETAILS ── */}
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h2 className="text-lg font-bold text-purple-700 mb-5 pb-2 border-b border-purple-100">
              📍 Contact Details
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <Detail label="Permanent Address" value={student.permanent_address} />
              <Detail label="Current Address" value={student.current_address} />
              <Detail label="District" value={student.district} />
              <Detail label="Home Phone" value={student.home_phone} />
            </div>
          </div>

          {/* ── FAMILY DETAILS ── */}
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h2 className="text-lg font-bold text-green-700 mb-5 pb-2 border-b border-green-100">
              👨‍👩‍👧 Family Details
            </h2>
            <div className="grid grid-cols-3 gap-5">
              <Detail label="Father Name" value={student.father_name} />
              <Detail label="Mother Name" value={student.mother_name} />
              <Detail label="Father Phone" value={student.father_phone} />
              <Detail label="Mother Phone" value={student.mother_phone} />
              <Detail label="Father Occupation" value={student.father_occupation} />
              <Detail label="Mother Occupation" value={student.mother_occupation} />
              <Detail label="Monthly Family Income" value={student.monthly_income} />
              <Detail label="Guardian Name" value={student.guardian_name} />
              <Detail label="Guardian Phone" value={student.guardian_phone} />
            </div>
          </div>

          {/* ── ACADEMIC DETAILS ── */}
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h2 className="text-lg font-bold text-orange-700 mb-5 pb-2 border-b border-orange-100">
              🎓 Academic Qualifications
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <Detail label="School Name" value={student.school_name} />
              <Detail label="Education Year" value={student.education_year} />
              <Detail label="Qualification" value={student.qualification} />
              <Detail label="Exam Results" value={student.exam_results} />
              <Detail label="Other Qualifications" value={student.other_qualifications} />
            </div>
          </div>

          {/* ── BOTTOM ACTIONS ── */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <Pencil size={16} />
              Edit Student
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <Trash2 size={16} />
              Delete Student
            </button>

            <button
              onClick={() => navigate("/students-list")}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              <ArrowLeft size={16} />
              Back to List
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// =========================
// DETAIL COMPONENT
// =========================

function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

export default StudentView;