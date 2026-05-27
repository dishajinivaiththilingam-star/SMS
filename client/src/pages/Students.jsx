import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {
  const navigate = useNavigate();
  const { id: editParamId } = useParams(); // /students/edit/:id

  const isEditMode = !!editParamId;

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // PERSONAL
  const [student_id, setStudentId] = useState("");
  const [student_name, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [selected_course_ids, setSelectedCourseIds] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [occupation, setOccupation] = useState("");
  const [admission_date, setAdmissionDate] = useState("");

  // CONTACT
  const [permanent_address, setPermanentAddress] = useState("");
  const [current_address, setCurrentAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [home_phone, setHomePhone] = useState("");

  // FAMILY
  const [father_name, setFatherName] = useState("");
  const [mother_name, setMotherName] = useState("");
  const [father_phone, setFatherPhone] = useState("");
  const [mother_phone, setMotherPhone] = useState("");
  const [father_occupation, setFatherOccupation] = useState("");
  const [mother_occupation, setMotherOccupation] = useState("");
  const [monthly_income, setMonthlyIncome] = useState("");
  const [guardian_name, setGuardianName] = useState("");
  const [guardian_phone, setGuardianPhone] = useState("");

  // EDUCATION
  const [school_name, setSchoolName] = useState("");
  const [education_year, setEducationYear] = useState("");
  const [qualification, setQualification] = useState("");
  const [exam_results, setExamResults] = useState("");
  const [other_qualifications, setOtherQualifications] = useState("");

  // =========================
  // AUTO-GENERATE STUDENT ID
  // =========================

  const generateStudentId = (existingStudents) => {
    if (!existingStudents || existingStudents.length === 0) return "STU001";
    const nums = existingStudents
      .map((s) => {
        const match = s.student_id?.match(/\d+$/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0;
    return `STU${String(maxNum + 1).padStart(3, "0")}`;
  };

  // =========================
  // TOGGLE COURSE
  // =========================

  const handleCourseToggle = (courseId) => {
    const id = String(courseId);
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = (existingStudents) => {
    setEditId(null);
    setStudentId(generateStudentId(existingStudents || students));
    setStudentName(""); setEmail(""); setPhone(""); setGender("");
    setSelectedCourseIds([]); setPhoto(null);
    setNic(""); setDob(""); setOccupation(""); setAdmissionDate("");
    setPermanentAddress(""); setCurrentAddress(""); setDistrict(""); setHomePhone("");
    setFatherName(""); setMotherName(""); setFatherPhone(""); setMotherPhone("");
    setFatherOccupation(""); setMotherOccupation(""); setMonthlyIncome("");
    setGuardianName(""); setGuardianPhone("");
    setSchoolName(""); setEducationYear(""); setQualification("");
    setExamResults(""); setOtherQualifications("");
  };

  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      const data = res.data.data || res.data;
      setStudents(data);
      return data;
    } catch (error) {
      console.log(error);
      return [];
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
  // LOAD STUDENT FOR EDIT (if edit mode)
  // =========================

  const loadStudentForEdit = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/students/${id}`);
      const student = res.data;

      setEditId(student.id);
      setStudentId(student.student_id || "");
      setStudentName(student.student_name || "");
      setEmail(student.email || "");
      setPhone(student.phone || "");
      setGender(student.gender || "");

      const ids = (student.course_ids || []).map(String);
      setSelectedCourseIds(ids);

      setNic(student.nic || "");
      setDob(student.dob || "");
      setOccupation(student.occupation || "");
      setAdmissionDate(student.admission_date || "");
      setPermanentAddress(student.permanent_address || "");
      setCurrentAddress(student.current_address || "");
      setDistrict(student.district || "");
      setHomePhone(student.home_phone || "");
      setFatherName(student.father_name || "");
      setMotherName(student.mother_name || "");
      setFatherPhone(student.father_phone || "");
      setMotherPhone(student.mother_phone || "");
      setFatherOccupation(student.father_occupation || "");
      setMotherOccupation(student.mother_occupation || "");
      setMonthlyIncome(student.monthly_income || "");
      setGuardianName(student.guardian_name || "");
      setGuardianPhone(student.guardian_phone || "");
      setSchoolName(student.school_name || "");
      setEducationYear(student.education_year || "");
      setQualification(student.qualification || "");
      setExamResults(student.exam_results || "");
      setOtherQualifications(student.other_qualifications || "");
    } catch (error) {
      console.log(error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load student data" });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SUBMIT (ADD / UPDATE)
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_course_ids.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select Course",
        text: "Please select at least one course.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("student_id", student_id);
      formData.append("student_name", student_name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("course_id", selected_course_ids[0]);
      formData.append("course_ids", JSON.stringify(selected_course_ids));
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("occupation", occupation);
      formData.append("admission_date", admission_date);
      formData.append("permanent_address", permanent_address);
      formData.append("current_address", current_address);
      formData.append("district", district);
      formData.append("home_phone", home_phone);
      formData.append("father_name", father_name);
      formData.append("mother_name", mother_name);
      formData.append("father_phone", father_phone);
      formData.append("mother_phone", mother_phone);
      formData.append("father_occupation", father_occupation);
      formData.append("mother_occupation", mother_occupation);
      formData.append("monthly_income", monthly_income);
      formData.append("guardian_name", guardian_name);
      formData.append("guardian_phone", guardian_phone);
      formData.append("school_name", school_name);
      formData.append("education_year", education_year);
      formData.append("qualification", qualification);
      formData.append("exam_results", exam_results);
      formData.append("other_qualifications", other_qualifications);
      if (photo) formData.append("photo", photo);

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/students/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Student Updated Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/students-list");
      } else {
        await axios.post(
          "http://localhost:5000/api/students",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Student Added Successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        const updatedStudents = await getStudents();
        resetForm(updatedStudents);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      const data = await getStudents();
      await getCourses();
      if (isEditMode) {
        await loadStudentForEdit(editParamId);
      } else {
        setStudentId(generateStudentId(data));
      }
    };
    loadData();
  }, [editParamId]);

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-[250px] w-full min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-10">

          {/* ── HEADER ── */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/students-list")}
              className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 transition text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEditMode ? "Edit Student" : "Student Admission Form"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isEditMode
                  ? "Update the student information below"
                  : "Fill in all the required details to register a new student"}
              </p>
            </div>
          </div>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── PERSONAL DETAILS ── */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-xl font-bold text-blue-700 mb-6 pb-2 border-b border-blue-100">
                🧑 Personal Details
              </h2>

              <div className="grid grid-cols-3 gap-5">

                {/* STUDENT ID */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Student ID
                    <span className="ml-2 text-xs text-blue-500 font-normal">(Auto Generated)</span>
                  </label>
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                    value={student_id}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={student_name} required onChange={(e) => setStudentName(e.target.value)} placeholder="Enter Student Name" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Email Address<span className="text-red-500">*</span></label>
                  <input type="email" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Mobile Number</label>
                  <input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Mobile Number" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Gender</label>
                  <select className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">NIC Number</label>
                  <input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={nic} onChange={(e) => setNic(e.target.value)} placeholder="Enter NIC Number" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Date of Birth<span className="text-red-500">*</span></label>
                  <input type="date" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Occupation</label>
                  <input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Enter Occupation" />
                </div>


                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Admission Date <span className="text-red-500">*</span>
                  </label>
                  <input type="date" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={admission_date} required onChange={(e) => setAdmissionDate(e.target.value)} />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">
                    Student Photo {isEditMode && <span className="text-xs text-gray-400">(leave blank to keep existing)</span>}
                  </label>
                  <input type="file" className="border p-3 rounded-lg w-full text-sm" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>
              </div>

              {/* COURSE SELECTION */}
              <div className="mt-6">
                <label className="block mb-3 font-semibold text-gray-700">
                  Courses <span className="text-sm text-gray-400 font-normal">(Select one or more)</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {courses.map((course) => {
                    const isSelected = selected_course_ids.includes(String(course.id));
                    return (
                      <label
                        key={course.id}
                        className={`flex items-center gap-3 border-2 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600"
                          checked={isSelected}
                          onChange={() => handleCourseToggle(course.id)}
                        />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{course.course_name}</p>
                          {course.duration && (
                            <p className="text-xs text-gray-400">{course.duration}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selected_course_ids.length === 0 && (
                  <p className="text-sm text-red-400 mt-2">⚠ Please select at least one course</p>
                )}
                {selected_course_ids.length > 0 && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {selected_course_ids.length} course{selected_course_ids.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>

            {/* ── CONTACT DETAILS ── */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-xl font-bold text-purple-700 mb-6 pb-2 border-b border-purple-100">
                📍 Contact Details
              </h2>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Permanent Address</label>
                  <textarea className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" rows="3" value={permanent_address} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Enter Permanent Address" />
                </div>
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Current Address<span className="text-red-500">*</span></label>
                  <textarea className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" rows="3" value={current_address} onChange={(e) => setCurrentAddress(e.target.value)} placeholder="Enter Current Address" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">District</label>
                  <input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter District" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Home Phone Number<span className="text-red-500">*</span></label>
                  <input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={home_phone} required onChange={(e) => setHomePhone(e.target.value)} placeholder="Enter Home Phone Number" />
                </div>
              </div>
            </div>

            {/* ── FAMILY DETAILS ── */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-xl font-bold text-green-700 mb-6 pb-2 border-b border-green-100">
                👨‍👩‍👧 Family Details
              </h2>
              <div className="grid grid-cols-3 gap-5">
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Father Name</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={father_name} onChange={(e) => setFatherName(e.target.value)} placeholder="Enter Father Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Mother Name</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={mother_name} onChange={(e) => setMotherName(e.target.value)} placeholder="Enter Mother Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Father Phone</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={father_phone} onChange={(e) => setFatherPhone(e.target.value)} placeholder="Enter Father Phone" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Mother Phone</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={mother_phone} onChange={(e) => setMotherPhone(e.target.value)} placeholder="Enter Mother Phone" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Father Occupation</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={father_occupation} onChange={(e) => setFatherOccupation(e.target.value)} placeholder="Enter Father Occupation" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Mother Occupation</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={mother_occupation} onChange={(e) => setMotherOccupation(e.target.value)} placeholder="Enter Mother Occupation" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Monthly Family Income</label><input type="number" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={monthly_income} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="Enter Monthly Income" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Guardian Name</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={guardian_name} onChange={(e) => setGuardianName(e.target.value)} placeholder="Enter Guardian Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Guardian Phone</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={guardian_phone} onChange={(e) => setGuardianPhone(e.target.value)} placeholder="Enter Guardian Phone" /></div>
              </div>
            </div>

            {/* ── ACADEMIC QUALIFICATIONS ── */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-xl font-bold text-orange-700 mb-6 pb-2 border-b border-orange-100">
                🎓 Academic Qualifications
              </h2>
              <div className="grid grid-cols-3 gap-5">
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">School Name</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={school_name} onChange={(e) => setSchoolName(e.target.value)} placeholder="Enter School Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Education Year</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={education_year} onChange={(e) => setEducationYear(e.target.value)} placeholder="Enter Education Year" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700 text-sm">Qualification</label><input type="text" className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="Enter Qualification" /></div>
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Exam Results</label>
                  <textarea className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" rows="3" value={exam_results} onChange={(e) => setExamResults(e.target.value)} placeholder="Enter Exam Results" />
                </div>
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700 text-sm">Other Qualifications</label>
                  <textarea className="border p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" rows="3" value={other_qualifications} onChange={(e) => setOtherQualifications(e.target.value)} placeholder="Enter Other Qualifications" />
                </div>
              </div>
            </div>

            {/* ── SUBMIT BUTTONS ── */}
            <div className="flex gap-4 pb-6">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md"
              >
                <Save size={18} />
                {isEditMode ? "Update Student" : "Add Student"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/students-list")}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold transition"
              >
                <ArrowLeft size={18} />
                Back to List
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Students;