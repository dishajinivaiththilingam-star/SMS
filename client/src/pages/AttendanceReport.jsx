import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AttendanceReport() {

  const [attendance, setAttendance] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedCourse, setSelectedCourse] =
    useState("");



  // =========================
  // GET ATTENDANCE
  // =========================

  const getAttendance =
    async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/attendance"
        );

      setAttendance(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // GET STUDENTS
  // =========================

  const getStudents =
    async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/students"
        );

      setStudents(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // GET COURSES
  // =========================

  const getCourses =
    async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/courses"
        );

      setCourses(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // PDF DOWNLOAD
  // =========================

  const downloadPDF = () => {

    const doc =
      new jsPDF();



    doc.setFontSize(20);

    doc.text(
      "Attendance Report",
      14,
      20
    );



    const tableColumn = [

      "Student ID",
      "Student Name",
      "Course",
      "Date",
      "Status"

    ];



    const tableRows = [];



    filteredAttendance.forEach(
      (item) => {

        const student =
          students.find(
            (s) =>
              s.id ==
              item.student_id
          );



        const course =
          courses.find(
            (c) =>
              c.id ==
              item.course_id
          );



        tableRows.push([

          student?.student_id,

          student?.student_name,

          course?.course_name,

          item.date,

          item.status

        ]);

      }
    );



    autoTable(doc, {

      head: [tableColumn],

      body: tableRows,

      startY: 30

    });



    doc.save(
      "Attendance_Report.pdf"
    );

  };



  // =========================
  // FILTER DATA
  // =========================

  const filteredAttendance =
    attendance.filter((item) => {

      const student =
        students.find(
          (s) =>
            s.id ==
            item.student_id
        );



      const studentName =
        student?.student_name
          ?.toLowerCase() || "";



      const searchMatch =
        studentName.includes(
          search.toLowerCase()
        );



      const courseMatch =
        selectedCourse
          ? item.course_id ==
            selectedCourse
          : true;



      return (
        searchMatch &&
        courseMatch
      );

    });




  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getAttendance();

    getStudents();

    getCourses();

  }, []);




  return (

    <div className="flex">

      <Sidebar />



      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />



        <div className="p-10">

          {/* HEADER */}

          <div className="flex justify-between items-center mb-10">

            <h1 className="text-3xl font-bold">

              Attendance Report

            </h1>



            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
            >
              Download PDF
            </button>

          </div>



          {/* FILTER */}

          <div className="bg-white p-5 rounded-xl shadow mb-10 flex gap-5">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search Student..."
              className="border p-3 rounded w-[300px]"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />



            {/* COURSE */}

            <select
              className="border p-3 rounded"
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(
                  e.target.value
                )
              }
            >

              <option value="">
                All Courses
              </option>

              {courses.map((course) => (

                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.course_name}
                </option>

              ))}

            </select>

          </div>



          {/* TABLE */}

          <div className="bg-white p-6 rounded-xl shadow overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-3 text-left">
                    Student ID
                  </th>

                  <th className="p-3 text-left">
                    Student Name
                  </th>

                  <th className="p-3 text-left">
                    Course
                  </th>

                  <th className="p-3 text-left">
                    Date
                  </th>

                  <th className="p-3 text-left">
                    Status
                  </th>

                </tr>

              </thead>



              <tbody>

                {filteredAttendance.map(
                  (item) => {

                    const student =
                      students.find(
                        (s) =>
                          s.id ==
                          item.student_id
                      );



                    const course =
                      courses.find(
                        (c) =>
                          c.id ==
                          item.course_id
                      );



                    return (

                      <tr
                        key={item.id}
                        className="border-b"
                      >

                        <td className="p-3">

                          {
                            student?.student_id
                          }

                        </td>



                        <td className="p-3">

                          {
                            student?.student_name
                          }

                        </td>



                        <td className="p-3">

                          {
                            course?.course_name
                          }

                        </td>



                        <td className="p-3">

                          {item.date}

                        </td>



                        <td className="p-3">

                          <span
                            className={`px-3 py-1 rounded text-white ${
                              item.status ===
                              "Present"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {item.status}
                          </span>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AttendanceReport;