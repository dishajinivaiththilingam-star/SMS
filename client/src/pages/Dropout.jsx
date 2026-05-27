import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  UserX,
  Search,
  X,
  AlertTriangle,
  Calendar,
  BookOpen,
  Phone,
  Mail,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dropout() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // "active" | "dropped" | "all"
  const [loading, setLoading] = useState(true);

  // Dropout modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dropoutReason, setDropoutReason] = useState("");
  const [dropoutDate, setDropoutDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [submitting, setSubmitting] = useState(false);

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
  // OPEN DROPOUT MODAL
  // =========================

  const openDropoutModal = (student) => {
    setSelectedStudent(student);
    setDropoutReason("");
    setDropoutDate(new Date().toISOString().split("T")[0]);
    setShowModal(true);
  };

  // =========================
  // SUBMIT DROPOUT
  // =========================

  const handleDropout = async (e) => {
    e.preventDefault();

    if (!dropoutReason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please enter a dropout reason.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setSubmitting(true);

    try {
      await axios.put(
        `http://localhost:5000/api/students/${selectedStudent.id}/dropout`,
        {
          dropout_reason: dropoutReason,
          dropout_date: dropoutDate,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Dropout Recorded",
        text: `${selectedStudent.student_name} has been marked as dropped out.`,
        timer: 2500,
        showConfirmButton: false,
      });

      setShowModal(false);
      setSelectedStudent(null);
      getStudents();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to record dropout.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RESTORE STUDENT (UNDO DROPOUT)
  // =========================

  const handleRestore = async (student) => {
    const result = await Swal.fire({
      title: "Restore Student?",
      text: `Are you sure you want to restore ${student.student_name} as an active student?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Restore",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:5000/api/students/${student.id}/dropout`,
        {
          dropout_reason: null,
          dropout_date: null,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Restored!",
        text: `${student.student_name} has been restored as an active student.`,
        timer: 2000,
        showConfirmButton: false,
      });

      getStudents();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to restore student.",
      });
    }
  };

  // =========================
  // FILTERED STUDENTS
  // =========================

  const filteredStudents = students.filter((student) => {
    const nameMatch =
      student.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase());

    const courseNames = getStudentCourseNames(student);
    const courseMatch = courseFilter
      ? courseNames.some((name) => name === courseFilter)
      : true;

    const isDropped = !!student.dropout_reason || !!student.dropout_date;
    let statusMatch = true;
    if (statusFilter === "active") statusMatch = !isDropped;
    else if (statusFilter === "dropped") statusMatch = isDropped;

    return nameMatch && courseMatch && statusMatch;
  });

  // =========================
  // STATS
  // =========================

  const totalStudents = students.length;
  const droppedStudents = students.filter(
    (s) => s.dropout_reason || s.dropout_date
  ).length;
  const activeStudents = totalStudents - droppedStudents;
  const dropoutRate =
    totalStudents > 0
      ? ((droppedStudents / totalStudents) * 100).toFixed(1)
      : 0;

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

      <div className="ml-[250px] w-full min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-10">

          {/* ── HEADER ── */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-100 p-2 rounded-xl">
                  <UserX size={24} className="text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Student Dropout Management
                </h1>
              </div>
              <p className="text-gray-500 ml-14">
                Track and manage student dropout records
              </p>
            </div>
          </div>

          {/* ── STATS CARDS ── */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500 mb-1 font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-500 mb-1 font-medium">Active Students</p>
              <p className="text-3xl font-bold text-green-600">{activeStudents}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-500 mb-1 font-medium">Dropped Out</p>
              <p className="text-3xl font-bold text-red-600">{droppedStudents}</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-orange-500">
              <p className="text-sm text-gray-500 mb-1 font-medium">Dropout Rate</p>
              <p className="text-3xl font-bold text-orange-600">{dropoutRate}%</p>
            </div>
          </div>

          {/* ── FILTERS ── */}
          <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-wrap gap-4 items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-[260px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, ID or email..."
                className="w-full border border-gray-200 pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
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

            {/* Status Filter */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "All", color: "gray" },
                { value: "active", label: "Active", color: "green" },
                { value: "dropped", label: "Dropped", color: "red" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === opt.value
                      ? opt.value === "dropped"
                        ? "bg-red-500 text-white"
                        : opt.value === "active"
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Course Filter */}
            <select
              className="border border-gray-200 p-2.5 rounded-lg bg-gray-50 text-sm min-w-[200px] focus:outline-none focus:ring-2 focus:ring-red-400"
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

            {/* Clear */}
            {(search || courseFilter || statusFilter !== "active") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCourseFilter("");
                  setStatusFilter("active");
                }}
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
                <div className="animate-spin w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <UserX size={48} className="mx-auto mb-4 opacity-30" />
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
                      Contact
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Dropout Info
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => {
                    const courseNames = getStudentCourseNames(student);
                    const isDropped = !!student.dropout_reason || !!student.dropout_date;

                    return (
                      <tr
                        key={student.id}
                        className={`transition-colors ${
                          isDropped
                            ? "bg-red-50/40 hover:bg-red-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* STUDENT */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={
                                  student.image_url ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    student.student_name
                                  )}&background=${isDropped ? "ef4444" : "3b82f6"}&color=fff`
                                }
                                alt={student.student_name}
                                className={`w-11 h-11 rounded-full object-cover border-2 shadow ${
                                  isDropped ? "border-red-200 grayscale" : "border-white"
                                }`}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    student.student_name
                                  )}&background=${isDropped ? "ef4444" : "3b82f6"}&color=fff`;
                                }}
                              />
                              {isDropped && (
                                <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                                  <X size={10} className="text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`font-semibold text-sm ${isDropped ? "text-gray-500" : "text-gray-800"}`}>
                                {student.student_name}
                              </p>
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                {student.student_id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* CONTACT */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail size={11} />
                              <span>{student.email || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone size={11} />
                              <span>{student.phone || "—"}</span>
                            </div>
                          </div>
                        </td>

                        {/* COURSES */}
                        <td className="p-4">
                          {courseNames.length === 0 ? (
                            <span className="text-gray-400 text-xs">No courses</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {courseNames.slice(0, 2).map((name, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    isDropped
                                      ? "bg-gray-100 text-gray-500"
                                      : "bg-indigo-100 text-indigo-700"
                                  }`}
                                >
                                  {name}
                                </span>
                              ))}
                              {courseNames.length > 2 && (
                                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                                  +{courseNames.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="p-4">
                          {isDropped ? (
                            <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold w-fit">
                              <UserX size={12} />
                              Dropped Out
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold w-fit">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              Active
                            </span>
                          )}
                        </td>

                        {/* DROPOUT INFO */}
                        <td className="p-4">
                          {isDropped ? (
                            <div className="max-w-[200px]">
                              <div className="flex items-center gap-1 text-xs text-red-600 font-medium mb-1">
                                <Calendar size={11} />
                                {student.dropout_date || "—"}
                              </div>
                              <p className="text-xs text-gray-500 truncate" title={student.dropout_reason}>
                                {student.dropout_reason || "—"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/students/${student.id}`)}
                              title="View Student"
                              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                            >
                              <Eye size={15} />
                            </button>

                            {isDropped ? (
                              <button
                                onClick={() => handleRestore(student)}
                                title="Restore Student"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition text-xs font-medium"
                              >
                                <RotateCcw size={13} />
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => openDropoutModal(student)}
                                title="Mark as Dropout"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition text-xs font-medium"
                              >
                                <UserX size={13} />
                                Dropout
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* COUNT */}
          {!loading && filteredStudents.length > 0 && (
            <p className="text-center text-sm text-gray-400 mt-4">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          )}
        </div>
      </div>

      {/* ── DROPOUT MODAL ── */}
{showModal && selectedStudent && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">

    <div
      className="
        bg-white
        rounded-2xl
        shadow-2xl
        w-full
        max-w-md
        my-8
        max-h-[95vh]
        overflow-y-auto
      "
    >

      {/* Modal Header */}
      <div className="bg-red-500 rounded-t-2xl p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <AlertTriangle size={20} className="text-white" />
            </div>

            <div>
              <h2 className="text-white font-bold text-lg">
                Mark as Dropout
              </h2>

              <p className="text-red-100 text-sm">
                This action will be recorded
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="text-white/80 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Student Info */}
      <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-3">
        <img
          src={
            selectedStudent.image_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              selectedStudent.student_name
            )}&background=3b82f6&color=fff`
          }
          alt=""
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              selectedStudent.student_name
            )}&background=3b82f6&color=fff`;
          }}
        />

        <div>
          <p className="font-bold text-gray-800">
            {selectedStudent.student_name}
          </p>

          <p className="text-sm text-gray-500">
            ID: {selectedStudent.student_id} •{" "}
            {selectedStudent.phone || "No phone"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleDropout}
        className="p-6 space-y-5"
      >

        {/* Dropout Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dropout Date <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            value={dropoutDate}
            onChange={(e) => setDropoutDate(e.target.value)}
            required
          />
        </div>

        {/* Dropout Reason */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for Dropout <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              "Financial Difficulty",
              "Family Issues",
              "Health Problems",
              "Employment",
              "Relocation",
              "Personal Reasons",
              "Academic Performance",
              "Other",
            ].map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setDropoutReason(reason)}
                className={`text-xs px-3 py-2 rounded-lg border transition text-left ${
                  dropoutReason === reason
                    ? "border-red-400 bg-red-50 text-red-700 font-medium"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          <textarea
            rows="3"
            placeholder="Add additional details or type a custom reason..."
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none"
            value={dropoutReason}
            onChange={(e) => setDropoutReason(e.target.value)}
            required
          />
        </div>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertTriangle
            size={16}
            className="text-amber-500 mt-0.5 shrink-0"
          />

          <p className="text-xs text-amber-700">
            This will mark the student as dropped out.
            You can restore them later using the Restore option.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 sticky bottom-0 bg-white pt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 py-3 rounded-xl font-semibold text-white text-sm transition ${
              submitting
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {submitting ? "Saving..." : "Confirm Dropout"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}

export default Dropout;