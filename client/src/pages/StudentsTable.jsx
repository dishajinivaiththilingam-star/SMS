import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Pencil, Trash2, Download, UserPlus, X } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StudentsTable() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data.data || res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
  // DELETE STUDENT
  // =========================

  const deleteStudent = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Student Deleted Successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      getStudents();
    } catch (error) {
      console.log(error);
      Swal.fire({ icon: "error", title: "Error", text: "Delete Failed" });
    }
  };

  // =========================
  // EXPORT EXCEL
  // =========================

  const exportExcel = () => {
    const exportData = filteredStudents.map((student) => ({
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
      icon: "success",
      title: "Exported",
      text: "Excel File Downloaded Successfully",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // =========================
  // FILTERED STUDENTS
  // =========================

  const filteredStudents = students.filter((student) => {
    const nameMatch =
      student.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.phone?.includes(search);

    const courseNames = getStudentCourseNames(student);
    const courseMatch = courseFilter
      ? courseNames.some((name) => name === courseFilter)
      : true;

    return nameMatch && courseMatch;
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    getStudents();
    getCourses();
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

          {/* ── HEADER ── */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">All Students</h1>
              <p className="text-gray-500 mt-1">
                Total:{" "}
                <span className="font-semibold text-blue-600">
                  {filteredStudents.length}
                </span>{" "}
                students
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                <Download size={18} />
                Export Excel
              </button>

              <button
                onClick={() => navigate("/students")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                <UserPlus size={18} />
                Add Student
              </button>
            </div>
          </div>

          {/* ── SEARCH + FILTER ── */}
          <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-wrap gap-4 items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-[260px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, ID, email or phone..."
                className="w-full border border-gray-200 pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Course Filter */}
            <select
              className="border border-gray-200 p-2.5 rounded-lg bg-gray-50 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.course_name}>
                  {course.course_name}
                </option>
              ))}
            </select>

            {/* Clear filters */}
            {(search || courseFilter) && (
              <button
                onClick={() => { setSearch(""); setCourseFilter(""); }}
                className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* ── TABLE ── */}
          <div className="bg-white rounded-xl shadow overflow-hidden">

            {loading ? (
              <div className="text-center py-20 text-gray-500">
                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🎓</div>
                <p className="text-lg font-medium">No students found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => {
                    const courseNames = getStudentCourseNames(student);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        {/* PHOTO + NAME */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                student.image_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  student.student_name
                                )}&background=3b82f6&color=fff`
                              }
                              alt={student.student_name}
                              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  student.student_name
                                )}&background=3b82f6&color=fff`;
                              }}
                            />
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                {student.student_name}
                              </p>
                              <p className="text-xs text-gray-400">{student.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                            {student.student_id}
                          </span>
                        </td>

                        {/* CONTACT */}
                        <td className="p-4">
                          <p className="text-sm text-gray-700">{student.phone || "—"}</p>
                        </td>

                        {/* GENDER */}
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              student.gender === "Male"
                                ? "bg-sky-100 text-sky-700"
                                : student.gender === "Female"
                                ? "bg-pink-100 text-pink-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {student.gender || "—"}
                          </span>
                        </td>

                        {/* COURSES */}
                        <td className="p-4">
                          {courseNames.length === 0 ? (
                            <span className="text-gray-400 text-xs">No courses</span>
                          ) : courseNames.length === 1 ? (
                            <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                              {courseNames[0]}
                            </span>
                          ) : (
                            <details className="cursor-pointer">
                              <summary className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium list-none inline-flex items-center gap-1 select-none hover:bg-indigo-200 transition-colors">
                                {courseNames.length} Courses ▾
                              </summary>
                              <div className="mt-2 flex flex-wrap gap-1 max-w-[220px]">
                                {courseNames.map((name, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-xs"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </details>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {/* View */}
                            <button
                              onClick={() => navigate(`/students/${student.id}`)}
                              title="View Student"
                              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => navigate(`/students/edit/${student.id}`)}
                              title="Edit Student"
                              className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition"
                            >
                              <Pencil size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteStudent(student.id)}
                              title="Delete Student"
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* ── FOOTER COUNT ── */}
          {!loading && filteredStudents.length > 0 && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsTable;