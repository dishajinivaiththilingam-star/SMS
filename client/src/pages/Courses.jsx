import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Courses() {

  // =========================
  // STATES
  // =========================

  const [courses, setCourses] =
    useState([]);

  const [course_name, setCourseName] =
    useState("");

  const [teacher_name, setTeacherName] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [course_fee, setCourseFee] =
    useState("");

  const [editId, setEditId] =
    useState(null);

  const [search, setSearch] =
    useState("");



  // =========================
  // GET COURSES
  // =========================

  const getCourses = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/courses"
        );

      setCourses(
        res.data.data || res.data
      );

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load courses"
      });

    }

  };



  // =========================
  // ADD / UPDATE COURSE
  // =========================

  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      // =========================
      // UPDATE
      // =========================

      if (editId) {

        await axios.put(
          `http://localhost:5000/api/courses/${editId}`,
          {
            course_name,
            teacher_name,
            duration,
            course_fee
          }
        );

        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Course Updated Successfully",
          timer: 2000,
          showConfirmButton: false
        });

      }

      // =========================
      // ADD
      // =========================

      else {

        await axios.post(
          "http://localhost:5000/api/courses",
          {
            course_name,
            teacher_name,
            duration,
            course_fee
          }
        );

        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Course Added Successfully",
          timer: 2000,
          showConfirmButton: false
        });

      }

      // =========================
      // RELOAD
      // =========================

      getCourses();



      // =========================
      // RESET
      // =========================

      setEditId(null);

      setCourseName("");

      setTeacherName("");

      setDuration("");

      setCourseFee("");

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong"
      });

    }

  };



  // =========================
  // EDIT COURSE
  // =========================

  const editCourse = (course) => {

    setEditId(course.id);

    setCourseName(
      course.course_name || ""
    );

    setTeacherName(
      course.teacher_name || ""
    );

    setDuration(
      course.duration || ""
    );

    setCourseFee(
      course.course_fee || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    Swal.fire({
      icon: "info",
      title: "Edit Mode",
      text: "Course loaded for editing",
      timer: 1500,
      showConfirmButton: false
    });

  };



  // =========================
  // DELETE COURSE
  // =========================

  const deleteCourse =
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
        `http://localhost:5000/api/courses/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text:
          "Course Deleted Successfully",
        timer: 2000,
        showConfirmButton: false
      });

      getCourses();

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Failed to delete course"
      });

    }

  };



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

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

            Course Management

          </h1>



          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow mb-10"
          >

            <div className="grid grid-cols-2 gap-5">

              {/* COURSE NAME */}

              <div>

                <label className="block mb-2 font-semibold text-gray-700">

                  Course Name

                </label>

                <input
                  type="text"
                  placeholder="Enter Course Name"
                  className="border p-3 rounded-lg w-full bg-white text-black"
                  value={course_name}
                  onChange={(e) =>
                    setCourseName(e.target.value)
                  }
                  required
                />

              </div>



              {/* TEACHER NAME */}

              <div>

                <label className="block mb-2 font-semibold text-gray-700">

                  Teacher Name

                </label>

                <input
                  type="text"
                  placeholder="Enter Teacher Name"
                  className="border p-3 rounded-lg w-full bg-white text-black"
                  value={teacher_name}
                  onChange={(e) =>
                    setTeacherName(e.target.value)
                  }
                  required
                />

              </div>



              {/* DURATION */}

              <div>

                <label className="block mb-2 font-semibold text-gray-700">

                  Duration

                </label>

                <input
                  type="text"
                  placeholder="Ex : 6 Months"
                  className="border p-3 rounded-lg w-full bg-white text-black"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  required
                />

              </div>



              {/* COURSE FEE */}

              <div>

                <label className="block mb-2 font-semibold text-gray-700">

                  Course Fee

                </label>

                <input
                  type="number"
                  placeholder="Enter Course Fee"
                  className="border p-3 rounded-lg w-full bg-white text-black"
                  value={course_fee}
                  onChange={(e) =>
                    setCourseFee(e.target.value)
                  }
                  required
                />

              </div>

            </div>



            {/* BUTTONS */}

            <div className="flex gap-3 mt-8">

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >

                {editId
                  ? "Update Course"
                  : "Add Course"}

              </button>



              {editId && (

                <button
                  type="button"
                  onClick={() => {

                    setEditId(null);

                    setCourseName("");

                    setTeacherName("");

                    setDuration("");

                    setCourseFee("");

                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                >

                  Cancel

                </button>

              )}

            </div>

          </form>



          {/* SEARCH */}

          <div className="mb-5">

            <input
              type="text"
              placeholder="Search Course..."
              className="border p-3 rounded-lg w-[300px] bg-white text-black"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>



          {/* TABLE */}

          <div className="bg-white p-6 rounded-2xl shadow overflow-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b bg-gray-100">

                  <th className="p-4 text-left">
                    #
                  </th>

                  <th className="p-4 text-left">
                    Course Name
                  </th>

                  <th className="p-4 text-left">
                    Teacher
                  </th>

                  <th className="p-4 text-left">
                    Duration
                  </th>

                  <th className="p-4 text-left">
                    Course Fee
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>



              <tbody>

                {courses
                  .filter((course) =>
                    course.course_name
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  )
                  .map((course, index) => (

                    <tr
                      key={course.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {index + 1}
                      </td>

                      <td className="p-4 font-medium">
                        {course.course_name}
                      </td>

                      <td className="p-4">
                        {course.teacher_name}
                      </td>

                      <td className="p-4">
                        {course.duration}
                      </td>

                      <td className="p-4">
                        Rs. {course.course_fee}
                      </td>

                      <td className="p-4 flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            editCourse(course)
                          }
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        >

                          Edit

                        </button>



                        <button
                          type="button"
                          onClick={() =>
                            deleteCourse(course.id)
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >

                          Delete

                        </button>

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>



            {courses.filter((course) =>
              course.course_name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            ).length === 0 && (

              <p className="text-center text-gray-500 mt-5">

                No Courses Found

              </p>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default Courses;