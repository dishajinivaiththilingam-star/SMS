import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [editId, setEditId] = useState(null);

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
  const [course_type, setCourseType] = useState("");
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
  // GET COURSE NAMES FOR STUDENT
  // =========================

  const getStudentCourseNames = (student) => {
    const ids = student.course_ids || [];
    if (ids.length === 0) return [];
    return ids
      .map((cid) => courses.find((c) => String(c.id) === String(cid))?.course_name)
      .filter(Boolean);
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = (existingStudents) => {
    setEditId(null);
    setStudentId(generateStudentId(existingStudents || students));
    setStudentName(""); setEmail(""); setPhone(""); setGender("");
    setSelectedCourseIds([]); setPhoto(null);
    setNic(""); setDob(""); setOccupation(""); setCourseType(""); setAdmissionDate("");
    setPermanentAddress(""); setCurrentAddress(""); setDistrict(""); setHomePhone("");
    setFatherName(""); setMotherName(""); setFatherPhone(""); setMotherPhone("");
    setFatherOccupation(""); setMotherOccupation(""); setMonthlyIncome("");
    setGuardianName(""); setGuardianPhone("");
    setSchoolName(""); setEducationYear(""); setQualification("");
    setExamResults(""); setOtherQualifications("");
  };

  // =========================
  // EXPORT EXCEL
  // =========================

  const exportExcel = () => {
    const exportData = students.map((student) => ({
      Student_ID: student.student_id,
      Student_Name: student.student_name,
      Email: student.email,
      Phone: student.phone,
      Gender: student.gender,
      NIC: student.nic,
      Father_Name: student.father_name,
      Mother_Name: student.mother_name,
      Courses: getStudentCourseNames(student).join(", "),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(fileData, "Students_Report.xlsx");
    Swal.fire({
      icon: "success", title: "Exported",
      text: "Excel File Downloaded Successfully",
      timer: 2000, showConfirmButton: false,
    });
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
  // SEARCH HANDLER
  // =========================

  const handleSearch = (value) => {
    setSearch(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const filtered = students.filter(
      (s) =>
        s.student_name?.toLowerCase().includes(value.toLowerCase()) ||
        s.student_id?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  // =========================
  // SUBMIT (ADD / UPDATE)
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_course_ids.length === 0) {
      Swal.fire({
        icon: "warning", title: "Select Course",
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
      formData.append("course_type", course_type);
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
        Swal.fire({ icon: "success", title: "Updated", text: "Student Updated Successfully", timer: 2000, showConfirmButton: false });
      } else {
        await axios.post(
          "http://localhost:5000/api/students",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Swal.fire({ icon: "success", title: "Added", text: "Student Added Successfully", timer: 2000, showConfirmButton: false });
      }

      const updatedStudents = await getStudents();
      resetForm(updatedStudents);

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error", title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const editStudent = (student) => {
    setEditId(student.id);
    setStudentId(student.student_id || "");
    setStudentName(student.student_name || "");
    setEmail(student.email || "");
    setPhone(student.phone || "");
    setGender(student.gender || "");

    // course_ids already parsed array from backend
    const ids = (student.course_ids || []).map(String);
    setSelectedCourseIds(ids);

    setNic(student.nic || "");
    setDob(student.dob || "");
    setOccupation(student.occupation || "");
    setCourseType(student.course_type || "");
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
    // other_qualifications already cleaned (marker stripped) by backend
    setOtherQualifications(student.other_qualifications || "");
    setAgreeDiscontinueFee(student.agree_discontinue_fee || false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      Swal.fire({ icon: "success", title: "Deleted", text: "Student Deleted Successfully", timer: 2000, showConfirmButton: false });
      const updatedStudents = await getStudents();
      if (!editId) setStudentId(generateStudentId(updatedStudents));
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      const data = await getStudents();
      await getCourses();
      setStudentId(generateStudentId(data));
    };
    loadData();
  }, []);

  // =========================
  // RENDER
  // =========================

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-10">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Student Admission Form</h1>
            <button
              onClick={exportExcel}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Export Excel
            </button>
          </div>

          {/* ========================= */}
          {/* SEARCH BOX + DROPDOWN     */}
          {/* ========================= */}

          <div className="relative mb-8 w-[400px]">
            <input
              type="text"
              placeholder="Search by Name or Student ID..."
              className="border p-3 rounded-lg w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => search && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />

            {showSearchResults && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[320px] overflow-auto mt-1">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No students found</div>
                ) : (
                  searchResults.map((student) => {
                    const courseNames = getStudentCourseNames(student);
                    return (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                        onMouseDown={() => {
                          navigate(`/students/${student.id}`);
                          setSearch("");
                          setShowSearchResults(false);
                        }}
                      >
                        <img
                          src={
                            student.image_url
                              ? student.image_url
                              : `https://ui-avatars.com/api/?name=${student.student_name}`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${student.student_name}`;
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">
                            {student.student_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {student.student_id}
                            {courseNames.length > 0 && (
                              <span className="ml-2 text-blue-600">
                                · {courseNames.join(", ")}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="ml-auto text-xs text-blue-500 font-medium flex-shrink-0">
                          View →
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* ========================= */}
          {/* ADMISSION FORM            */}
          {/* ========================= */}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow space-y-10"
          >

            {/* PERSONAL DETAILS */}
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-5 border-b pb-2">
                Personal Details
              </h2>

              <div className="grid grid-cols-3 gap-5">

                {/* STUDENT ID — AUTO */}
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Student ID
                    <span className="ml-2 text-xs text-blue-500 font-normal">
                      (Auto Generated)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="border p-3 rounded-lg w-full bg-gray-100 text-gray-600 cursor-not-allowed"
                    value={student_id}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Student Name <span className=" mb-2  text-red-600">*</span></label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={student_name} required onChange={(e) => setStudentName(e.target.value)} placeholder="Enter Student Name" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Email Address</label>
                  <input type="email" className="border p-3 rounded-lg w-full" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Mobile Number</label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Mobile Number" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Gender</label>
                  <select className="border p-3 rounded-lg w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">NIC Number</label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={nic} onChange={(e) => setNic(e.target.value)} placeholder="Enter NIC Number" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
                  <input type="date" className="border p-3 rounded-lg w-full" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Occupation</label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Enter Occupation" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Course Type</label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={course_type} onChange={(e) => setCourseType(e.target.value)} placeholder="Full Time / Part Time" />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Admission Date</label>
                  <input type="date" className="border p-3 rounded-lg w-full" value={admission_date} required onChange={(e) => setAdmissionDate(e.target.value)} />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Student Photo</label>
                  <input type="file" className="border p-3 rounded-lg w-full" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                </div>

              </div>

              {/* MULTIPLE COURSE SELECTION */}
              <div className="mt-6">
                <label className="block mb-3 font-semibold text-gray-700 text-lg">
                  Courses
                  <span className="ml-2 text-sm text-gray-400 font-normal">
                    (Select one or more)
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {courses.map((course) => {
                    const isSelected = selected_course_ids.includes(String(course.id));
                    return (
                      <label
                        key={course.id}
                        className={`flex items-center gap-3 border-2 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 bg-white"
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-blue-600 flex-shrink-0"
                          checked={isSelected}
                          onChange={() => handleCourseToggle(course.id)}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {course.course_name}
                          </p>
                          {course.duration && (
                            <p className="text-xs text-gray-500">{course.duration}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selected_course_ids.length === 0 && (
                  <p className="text-sm text-red-400 mt-2">
                    ⚠ Please select at least one course
                  </p>
                )}
                {selected_course_ids.length > 0 && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {selected_course_ids.length} course{selected_course_ids.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>

            {/* CONTACT DETAILS */}
            <div>
              <h2 className="text-2xl font-bold text-purple-700 mb-5 border-b pb-2">
                Contact Details
              </h2>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700">Permanent Address</label>
                  <textarea className="border p-3 rounded-lg w-full" rows="3" value={permanent_address} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Enter Permanent Address" />
                </div>
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700">Current Address</label>
                  <textarea className="border p-3 rounded-lg w-full" rows="3" value={current_address} onChange={(e) => setCurrentAddress(e.target.value)} placeholder="Enter Current Address" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">District</label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter District" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Home Phone Number</label>
                  <input type="text" className="border p-3 rounded-lg w-full" value={home_phone} required onChange={(e) => setHomePhone(e.target.value)} placeholder="Enter Home Phone Number" />
                </div>
              </div>
            </div>

            {/* FAMILY DETAILS */}
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-5 border-b pb-2">
                Family Details
              </h2>
              <div className="grid grid-cols-3 gap-5">
                <div><label className="block mb-2 font-semibold text-gray-700">Father Name</label><input type="text" className="border p-3 rounded-lg w-full" value={father_name} onChange={(e) => setFatherName(e.target.value)} placeholder="Enter Father Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Mother Name</label><input type="text" className="border p-3 rounded-lg w-full" value={mother_name} onChange={(e) => setMotherName(e.target.value)} placeholder="Enter Mother Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Father Phone</label><input type="text" className="border p-3 rounded-lg w-full" value={father_phone} onChange={(e) => setFatherPhone(e.target.value)} placeholder="Enter Father Phone" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Mother Phone</label><input type="text" className="border p-3 rounded-lg w-full" value={mother_phone} onChange={(e) => setMotherPhone(e.target.value)} placeholder="Enter Mother Phone" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Father Occupation</label><input type="text" className="border p-3 rounded-lg w-full" value={father_occupation} onChange={(e) => setFatherOccupation(e.target.value)} placeholder="Enter Father Occupation" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Mother Occupation</label><input type="text" className="border p-3 rounded-lg w-full" value={mother_occupation} onChange={(e) => setMotherOccupation(e.target.value)} placeholder="Enter Mother Occupation" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Monthly Family Income</label><input type="number" className="border p-3 rounded-lg w-full" value={monthly_income} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="Enter Monthly Income" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Guardian Name</label><input type="text" className="border p-3 rounded-lg w-full" value={guardian_name} onChange={(e) => setGuardianName(e.target.value)} placeholder="Enter Guardian Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Guardian Phone</label><input type="text" className="border p-3 rounded-lg w-full" value={guardian_phone} onChange={(e) => setGuardianPhone(e.target.value)} placeholder="Enter Guardian Phone" /></div>
              </div>
            </div>

            {/* ACADEMIC QUALIFICATIONS */}
            <div>
              <h2 className="text-2xl font-bold text-orange-700 mb-5 border-b pb-2">
                Academic Qualifications
              </h2>
              <div className="grid grid-cols-3 gap-5">
                <div><label className="block mb-2 font-semibold text-gray-700">School Name</label><input type="text" className="border p-3 rounded-lg w-full" value={school_name} onChange={(e) => setSchoolName(e.target.value)} placeholder="Enter School Name" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Education Year</label><input type="text" className="border p-3 rounded-lg w-full" value={education_year} onChange={(e) => setEducationYear(e.target.value)} placeholder="Enter Education Year" /></div>
                <div><label className="block mb-2 font-semibold text-gray-700">Qualification</label><input type="text" className="border p-3 rounded-lg w-full" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="Enter Qualification" /></div>
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700">Exam Results</label>
                  <textarea className="border p-3 rounded-lg w-full" rows="3" value={exam_results} onChange={(e) => setExamResults(e.target.value)} placeholder="Enter Exam Results" />
                </div>
                <div className="col-span-3">
                  <label className="block mb-2 font-semibold text-gray-700">Other Qualifications</label>
                  <textarea className="border p-3 rounded-lg w-full" rows="3" value={other_qualifications} onChange={(e) => setOtherQualifications(e.target.value)} placeholder="Enter Other Qualifications" />
                </div>
              </div>
            </div>


            {/* SUBMIT BUTTONS */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                {editId ? "Update Student" : "Add Student"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* ========================= */}
          {/* STUDENTS TABLE            */}
          {/* ========================= */}

          <div className="bg-white p-6 rounded-xl shadow mt-10 overflow-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">All Students</h2>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left">Photo</th>
                  <th className="p-3 text-left">Student ID</th>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Courses</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => {
                  const courseNames = getStudentCourseNames(student);
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">

                      {/* PHOTO */}
                      <td className="p-3">
                        <img
                          src={
                            student.image_url
                              ? student.image_url
                              : `https://ui-avatars.com/api/?name=${student.student_name}`
                          }
                          alt="Student"
                          className="w-14 h-14 rounded-full object-cover border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${student.student_name}`;
                          }}
                        />
                      </td>

                      {/* STUDENT ID */}
                      <td className="p-3 font-medium">{student.student_id}</td>

                      {/* NAME */}
                      <td className="p-3">{student.student_name}</td>

                      {/* PHONE */}
                      <td className="p-3">{student.phone}</td>

                      {/* COURSES DROPDOWN */}
                      <td className="p-3">
                        {courseNames.length === 0 ? (
                          <span className="text-gray-400 text-sm">No courses</span>
                        ) : courseNames.length === 1 ? (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {courseNames[0]}
                          </span>
                        ) : (
                          <details className="cursor-pointer">
                            <summary className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium list-none inline-flex items-center gap-1 select-none hover:bg-blue-200 transition-colors">
                              {courseNames.length} Courses ▾
                            </summary>
                            <div className="mt-2 flex flex-wrap gap-1 max-w-[250px]">
                              {courseNames.map((name, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </details>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => editStudent(student)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteStudent(student.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>

            {students.length === 0 && (
              <p className="text-center text-gray-500 mt-8 py-8">No Students Found</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Students;