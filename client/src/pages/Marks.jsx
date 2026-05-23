import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Marks() {

  // =========================
  // STATES
  // =========================

  const [marks, setMarks] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [student_id, setStudentId] =
    useState("");

  const [course_id, setCourseId] =
    useState("");

  const [exam_name, setExamName] =
    useState("");

  const [total_marks, setTotalMarks] =
    useState("");

  const [obtained_marks, setObtainedMarks] =
    useState("");

  const [search, setSearch] =
    useState("");



  // =========================
  // GET MARKS
  // =========================

  const getMarks = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/marks"
        );

      setMarks(res.data);

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load marks"
      });

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
  // ADD MARKS
  // =========================

  const addMarks =
    async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/marks",
        {

          student_id,
          course_id,
          exam_name,
          total_marks,
          obtained_marks

        }
      );



      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Marks Added Successfully",
        timer: 2000,
        showConfirmButton: false
      });



      // REFRESH

      getMarks();



      // RESET

      setStudentId("");

      setCourseId("");

      setExamName("");

      setTotalMarks("");

      setObtainedMarks("");

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to add marks"
      });

    }

  };



  // =========================
  // DELETE MARKS
  // =========================

  const deleteMarks =
    async (id) => {

    const result =
      await Swal.fire({

        title: "Are you sure?",

        text:
          "You won't be able to revert this!",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        cancelButtonColor: "#3085d6",

        confirmButtonText:
          "Yes, Delete"

      });



    if (!result.isConfirmed)
      return;



    try {

      await axios.delete(
        `http://localhost:5000/api/marks/${id}`
      );



      Swal.fire({
        icon: "success",
        title: "Deleted",
        text:
          "Marks Deleted Successfully",
        timer: 2000,
        showConfirmButton: false
      });



      getMarks();

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed to delete marks"
      });

    }

  };



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getMarks();

    getStudents();

    getCourses();

  }, []);




  return (

    <div className="flex">

      {/* SIDEBAR */}

      <Sidebar />



      {/* MAIN */}

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />



        <div className="p-10">

          {/* TITLE */}

          <h1 className="text-3xl font-bold text-black mb-10">

            Marks Management

          </h1>



          {/* FORM */}

          <form
            onSubmit={addMarks}
            className="bg-white p-6 rounded-xl shadow mb-10"
          >

            <div className="grid grid-cols-5 gap-5">

              {/* STUDENT */}

              <select
                className="border bg-white text-black p-3 rounded"
                value={student_id}
                onChange={(e) =>
                  setStudentId(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Student
                </option>

                {students.map(
                  (student) => (

                    <option
                      key={student.id}
                      value={student.id}
                    >

                      {
                        student.student_name
                      }

                    </option>

                  )
                )}

              </select>



              {/* COURSE */}

              <select
                className="border bg-white text-black p-3 rounded"
                value={course_id}
                onChange={(e) =>
                  setCourseId(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Select Course
                </option>

                {courses.map(
                  (course) => (

                    <option
                      key={course.id}
                      value={course.id}
                    >

                      {
                        course.course_name
                      }

                    </option>

                  )
                )}

              </select>



              {/* EXAM */}

              <input
                type="text"
                placeholder="Exam Name"
                className="border bg-white text-black p-3 rounded"
                value={exam_name}
                onChange={(e) =>
                  setExamName(
                    e.target.value
                  )
                }
                required
              />



              {/* TOTAL */}

              <input
                type="number"
                placeholder="Total Marks"
                className="border bg-white text-black p-3 rounded"
                value={total_marks}
                onChange={(e) =>
                  setTotalMarks(
                    e.target.value
                  )
                }
                required
              />



              {/* OBTAINED */}

              <input
                type="number"
                placeholder="Obtained Marks"
                className="border bg-white text-black p-3 rounded"
                value={obtained_marks}
                onChange={(e) =>
                  setObtainedMarks(
                    e.target.value
                  )
                }
                required
              />

            </div>



            {/* BUTTON */}

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded mt-5 hover:bg-blue-700"
            >

              Add Marks

            </button>

          </form>



          {/* SEARCH */}

          <div className="mb-5">

            <input
              type="text"
              placeholder="Search Student..."
              className="border bg-white text-black p-3 rounded w-[300px]"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>



          {/* TABLE */}

          <div className="bg-white p-6 rounded-xl shadow overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-3 text-left text-black">
                    Student
                  </th>

                  <th className="p-3 text-left text-black">
                    Course
                  </th>

                  <th className="p-3 text-left text-black">
                    Exam
                  </th>

                  <th className="p-3 text-left text-black">
                    Total
                  </th>

                  <th className="p-3 text-left text-black">
                    Obtained
                  </th>

                  <th className="p-3 text-left text-black">
                    Grade
                  </th>

                  <th className="p-3 text-left text-black">
                    Status
                  </th>

                  <th className="p-3 text-left text-black">
                    Action
                  </th>

                </tr>

              </thead>



              <tbody>

                {marks
                  .filter((item) => {

                    const student =
                      students.find(
                        (s) =>
                          s.id ==
                          item.student_id
                      );



                    return student
                      ?.student_name
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      );

                  })
                  .map((item) => (

                    <tr
                      key={item.id}
                      className="border-b"
                    >

                      {/* STUDENT */}

                      <td className="p-3 text-black">

                        {
                          students.find(
                            (student) =>
                              student.id ==
                              item.student_id
                          )?.student_name
                        }

                      </td>



                      {/* COURSE */}

                      <td className="p-3 text-black">

                        {
                          courses.find(
                            (course) =>
                              course.id ==
                              item.course_id
                          )?.course_name
                        }

                      </td>



                      {/* EXAM */}

                      <td className="p-3 text-black">
                        {item.exam_name}
                      </td>



                      {/* TOTAL */}

                      <td className="p-3 text-black">
                        {item.total_marks}
                      </td>



                      {/* OBTAINED */}

                      <td className="p-3 text-black">
                        {item.obtained_marks}
                      </td>



                      {/* GRADE */}

                      <td className="p-3">

                        <span className="bg-blue-600 text-white px-3 py-1 rounded">

                          {item.grade}

                        </span>

                      </td>



                      {/* STATUS */}

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded text-white ${
                            item.status ===
                            "Pass"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >

                          {item.status}

                        </span>

                      </td>



                      {/* ACTION */}

                      <td className="p-3">

                        <button
                          onClick={() =>
                            deleteMarks(
                              item.id
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >

                          Delete

                        </button>

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

export default Marks;