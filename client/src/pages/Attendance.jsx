import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Attendance() {

  // =========================
  // STATES
  // =========================

  const [courses, setCourses] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [attendanceList, setAttendanceList] =
    useState([]);

  const [course_id, setCourseId] =
    useState("");

  const [filterDate, setFilterDate] =
    useState("");



  // =========================
  // GET COURSES
  // =========================

  const getCourses = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/courses"
      );

      setCourses(res.data);

    } catch (error) {

      console.log(error);



      Swal.fire({
        title: "Error!",
        text: "Failed to load courses",
        icon: "error",
        confirmButtonColor: "#dc2626"
      });

    }

  };



  // =========================
  // GET STUDENTS
  // =========================

  const getStudents = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(res.data);

    } catch (error) {

      console.log(error);



      Swal.fire({
        title: "Error!",
        text: "Failed to load students",
        icon: "error",
        confirmButtonColor: "#dc2626"
      });

    }

  };



  // =========================
  // GET ATTENDANCE
  // =========================

  const getAttendance = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/attendance"
      );

      setAttendanceList(res.data);

    } catch (error) {

      console.log(error);



      Swal.fire({
        title: "Error!",
        text: "Failed to load attendance",
        icon: "error",
        confirmButtonColor: "#dc2626"
      });

    }

  };



  // =========================
  // HANDLE STATUS
  // =========================

  const handleStatusChange = (
    studentId,
    status
  ) => {

    const updatedStudents =
      students.map((student) => {

        if (student.id === studentId) {

          return {
            ...student,
            status
          };

        }

        return student;

      });

    setStudents(updatedStudents);

  };



  // =========================
  // SAVE ATTENDANCE
  // =========================

  const saveAttendance = async () => {

    try {

      const attendanceData =
        students
          .filter(
            (student) =>
              student.course_id ==
              course_id
          )
          .map((student) => ({
            student_id: student.id,
            course_id:
              Number(course_id),
            attendance_date:
              new Date()
                .toISOString()
                .split("T")[0],
            status:
              student.status ||
              "Absent"
          }));



      await axios.post(
        "http://localhost:5000/api/attendance",
        attendanceData
      );



      Swal.fire({
        title: "Success!",
        text: "Attendance Saved Successfully",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });



      getAttendance();

    } catch (error) {

      console.log(error);



      Swal.fire({
        title: "Error!",
        text: "Failed to save attendance",
        icon: "error",
        confirmButtonColor: "#dc2626"
      });

    }

  };



  // =========================
  // PRESENT COUNT
  // =========================

  const presentCount =
    attendanceList.filter(
      (item) =>
        item.status === "Present"
    ).length;



  // =========================
  // ABSENT COUNT
  // =========================

  const absentCount =
    attendanceList.filter(
      (item) =>
        item.status === "Absent"
    ).length;



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getCourses();
    getStudents();
    getAttendance();

  }, []);




  return (

    <div className="flex">

      <Sidebar />



      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />



        <div className="p-10">

          <h1 className="text-3xl font-bold mb-10 text-black">

            Attendance Management

          </h1>



          {/* FILTERS */}

          <div className="bg-white p-6 rounded-xl shadow mb-10 flex gap-5">

            {/* COURSE */}

            <select
              className="border bg-white text-black p-3 rounded"
              value={course_id}
              onChange={(e) =>
                setCourseId(e.target.value)
              }
            >

              <option value="">
                Select Course
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



            {/* DATE */}

            <input
              type="date"
              className="border bg-white text-black p-3 rounded"
              value={filterDate}
              onChange={(e) =>
                setFilterDate(e.target.value)
              }
            />

          </div>



          {/* SUMMARY */}

          <div className="grid grid-cols-2 gap-5 mb-10">

            <div className="bg-green-500 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Present

              </h2>

              <p className="text-4xl mt-3">

                {presentCount}

              </p>

            </div>



            <div className="bg-red-500 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Absent

              </h2>

              <p className="text-4xl mt-3">

                {absentCount}

              </p>

            </div>

          </div>



          {/* STUDENTS TABLE */}

          <div className="bg-white p-6 rounded-xl shadow mb-10 overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-3 text-left text-black">
                    Student ID
                  </th>

                  <th className="p-3 text-left text-black">
                    Student Name
                  </th>

                  <th className="p-3 text-left text-black">
                    Attendance
                  </th>

                </tr>

              </thead>



              <tbody>

                {students
                  .filter(
                    (student) =>
                      student.course_id ==
                      course_id
                  )
                  .map((student) => (

                    <tr
                      key={student.id}
                      className="border-b"
                    >

                      <td className="p-3 text-black">
                        {student.student_id}
                      </td>

                      <td className="p-3 text-black">
                        {student.student_name}
                      </td>

                      <td className="p-3">

                        <div className="flex gap-5">

                          <label className="text-black">

                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              onChange={() =>
                                handleStatusChange(
                                  student.id,
                                  "Present"
                                )
                              }
                            />

                            <span className="ml-2">
                              Present
                            </span>

                          </label>



                          <label className="text-black">

                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              onChange={() =>
                                handleStatusChange(
                                  student.id,
                                  "Absent"
                                )
                              }
                            />

                            <span className="ml-2">
                              Absent
                            </span>

                          </label>

                        </div>

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>



            <button
              onClick={saveAttendance}
              className="bg-blue-600 text-white px-6 py-3 rounded mt-5 hover:bg-blue-700"
            >
              Save Attendance
            </button>

          </div>



          {/* ATTENDANCE HISTORY */}

          <div className="bg-white p-6 rounded-xl shadow overflow-auto">

            <h2 className="text-2xl font-bold mb-5 text-black">

              Attendance History

            </h2>



            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-3 text-left text-black">
                    Student ID
                  </th>

                  <th className="p-3 text-left text-black">
                    Course ID
                  </th>

                  <th className="p-3 text-left text-black">
                    Date
                  </th>

                  <th className="p-3 text-left text-black">
                    Status
                  </th>

                </tr>

              </thead>



              <tbody>

                {attendanceList
                  .filter((item) => {

                    const courseMatch =
                      course_id
                        ? item.course_id ==
                          course_id
                        : true;

                    const dateMatch =
                      filterDate
                        ? item.attendance_date ==
                          filterDate
                        : true;

                    return (
                      courseMatch &&
                      dateMatch
                    );

                  })
                  .map((item) => (

                    <tr
                      key={item.id}
                      className="border-b"
                    >

                      <td className="p-3 text-black">
                        {item.student_id}
                      </td>

                      <td className="p-3 text-black">
                        {item.course_id}
                      </td>

                      <td className="p-3 text-black">
                        {item.attendance_date}
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

                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Attendance;