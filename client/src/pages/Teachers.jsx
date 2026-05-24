import { useEffect, useState } from "react";
import {
  useNavigate
} from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Teachers() {

  // =========================
  // STATES
  // =========================

  const [teachers, setTeachers] =
    useState([]);

  const navigate =
    useNavigate();

  const [courses, setCourses] =
    useState([]);

  const [teacher_name, setTeacherName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [qualification, setQualification] =
    useState("");

  const [experience, setExperience] =
    useState("");

  const [salary, setSalary] =
    useState("");

  const [joining_date, setJoiningDate] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [status, setStatus] =
    useState("Active");

  const [profileImage, setProfileImage] =
    useState(null);

  const [
    selectedCourses,
    setSelectedCourses
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  const [editId, setEditId] =
    useState(null);



  // =========================
  // GET TEACHERS
  // =========================

  const getTeachers = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/teachers"
        );

      setTeachers(
        res.data.data || res.data
      );

    } catch (error) {

      console.log(error);

    }

  };



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

    }

  };



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getTeachers();
    getCourses();

  }, []);




  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setEditId(null);

    setTeacherName("");

    setEmail("");

    setPhone("");

    setQualification("");

    setExperience("");

    setSalary("");

    setJoiningDate("");

    setGender("");

    setAddress("");

    setStatus("Active");

    setSelectedCourses([]);

    setProfileImage(null);

  };



  // =========================
  // HANDLE COURSE
  // =========================

  const handleCourseChange =
    (courseName) => {

      if (
        selectedCourses.includes(
          courseName
        )
      ) {

        setSelectedCourses(

          selectedCourses.filter(
            (item) =>
              item !== courseName
          )

        );

      }

      else {

        setSelectedCourses([
          ...selectedCourses,
          courseName
        ]);

      }

    };



  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const formData =
          new FormData();

        formData.append(
          "teacher_name",
          teacher_name
        );

        formData.append(
          "email",
          email
        );

        formData.append(
          "phone",
          phone
        );

        formData.append(
          "qualification",
          qualification
        );

        formData.append(
          "experience",
          experience
        );

        formData.append(
          "salary",
          salary
        );

        formData.append(
          "joining_date",
          joining_date
        );

        formData.append(
          "gender",
          gender
        );

        formData.append(
          "address",
          address
        );

        formData.append(
          "status",
          status
        );

        formData.append(
          "courses",
          JSON.stringify(
            selectedCourses
          )
        );



        if (profileImage) {

          formData.append(
            "profile_image",
            profileImage
          );

        }



        // UPDATE

        if (editId) {

          await axios.put(
            `http://localhost:5000/api/teachers/${editId}`,
            formData
          );

          Swal.fire({

            icon: "success",

            title: "Updated",

            text:
              "Teacher Updated Successfully",

            timer: 2000,

            showConfirmButton: false

          });

        }

        // ADD

        else {

          await axios.post(
            "http://localhost:5000/api/teachers",
            formData
          );

          Swal.fire({

            icon: "success",

            title: "Added",

            text:
              "Teacher Added Successfully",

            timer: 2000,

            showConfirmButton: false

          });

        }



        getTeachers();

        resetForm();

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
  // EDIT
  // =========================

  const editTeacher =
    (teacher) => {

      setEditId(teacher.id);

      setTeacherName(
        teacher.teacher_name || ""
      );

      setEmail(
        teacher.email || ""
      );

      setPhone(
        teacher.phone || ""
      );

      setQualification(
        teacher.qualification || ""
      );

      setExperience(
        teacher.experience || ""
      );

      setSalary(
        teacher.salary || ""
      );

      setJoiningDate(
        teacher.joining_date || ""
      );

      setGender(
        teacher.gender || ""
      );

      setAddress(
        teacher.address || ""
      );

      setStatus(
        teacher.status || "Active"
      );

      setSelectedCourses(

        teacher.courses
          ? teacher.courses.split(",")
          : []

      );



      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });

    };



  // =========================
  // DELETE
  // =========================

  const deleteTeacher =
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
          `http://localhost:5000/api/teachers/${id}`
        );

        Swal.fire({

          icon: "success",

          title: "Deleted",

          text:
            "Teacher Deleted Successfully",

          timer: 2000,

          showConfirmButton: false

        });

        getTeachers();

      } catch (error) {

        console.log(error);

      }

    };




  return (

    <div className="flex">

      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />

        <div className="p-10">

          {/* TITLE */}

          <h1 className="text-4xl font-bold mb-8">

            Teachers Management

          </h1>



          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Teacher..."
            className="border p-3 rounded-lg w-[300px] bg-white mb-8"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />



          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow mb-10"
          >

            <div className="grid grid-cols-3 gap-5">

              {/* NAME */}

              <div>

                <label className="block mb-2 font-semibold">

                  Teacher Name

                </label>

                <input
                  type="text"
                  className="border p-3 rounded-lg w-full"
                  value={teacher_name}
                  required
                  onChange={(e) =>
                    setTeacherName(e.target.value)
                  }
                  placeholder="Enter Teacher Name"
                />

              </div>



              {/* EMAIL */}

              <div>

                <label className="block mb-2 font-semibold">

                  Email

                </label>

                <input
                  type="email"
                  className="border p-3 rounded-lg w-full"
                  value={email}
                  required
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter Email"
                />

              </div>



              {/* PHONE */}

              <div>

                <label className="block mb-2 font-semibold">

                  Phone Number

                </label>

                <input
                  type="text"
                  className="border p-3 rounded-lg w-full"
                  value={phone}
                  required
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter Phone Number"
                />

              </div>



              {/* SALARY */}

              <div>

                <label className="block mb-2 font-semibold">

                  Salary

                </label>

                <input
                  type="number"
                  className="border p-3 rounded-lg w-full"
                  value={salary}
                  required
                  onChange={(e) =>
                    setSalary(e.target.value)
                  }
                  placeholder="Enter Salary"
                />

              </div>



              {/* JOINING DATE */}

              <div>

                <label className="block mb-2 font-semibold">

                  Joining Date

                </label>

                <input
                  type="date"
                  className="border p-3 rounded-lg w-full"
                  value={joining_date}
                  required
                  onChange={(e) =>
                    setJoiningDate(e.target.value)
                  }
                />

              </div>



              {/* GENDER */}

              <div>

                <label className="block mb-2 font-semibold">

                  Gender

                </label>

                <select
                  className="border p-3 rounded-lg w-full"
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                </select>

              </div>

            </div>



            {/* STATUS SMALL INPUT */}

            <div className="mt-6 w-[250px]">

              <label className="block mb-2 font-semibold">

                Status

              </label>

              <select
                className="border p-3 rounded-lg w-full"
                value={status}
                required
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>



            {/* QUALIFICATION */}

            <div className="mt-6">

              <label className="block mb-2 font-semibold">

                Qualification

              </label>

              <textarea
                rows="4"
                className="border p-3 rounded-lg w-full"
                value={qualification}
                onChange={(e) =>
                  setQualification(e.target.value)
                }
                placeholder="Enter Qualification"
              />

            </div>



            {/* EXPERIENCE */}

            <div className="mt-6">

              <label className="block mb-2 font-semibold">

                Experience

              </label>

              <textarea
                rows="4"
                className="border p-3 rounded-lg w-full"
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                placeholder="Enter Experience"
              />

            </div>



            {/* ADDRESS */}

            <div className="mt-6">

              <label className="block mb-2 font-semibold">

                Address

              </label>

              <textarea
                rows="4"
                className="border p-3 rounded-lg w-full"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                placeholder="Enter Address"
              />

            </div>



            {/* COURSES */}

            <div className="mt-8">

              <label className="block mb-4 font-semibold text-lg">

                Assigned Courses

              </label>



              <div className="grid grid-cols-3 gap-4">

                {courses.map((course) => (

                  <label
                    key={course.id}
                    className="flex items-center gap-3 border p-3 rounded-lg"
                  >

                    <input
                      type="checkbox"

                      checked={
                        selectedCourses.includes(
                          course.course_name
                        )
                      }

                      onChange={() =>
                        handleCourseChange(
                          course.course_name
                        )
                      }

                      className="w-5 h-5"
                    />

                    {course.course_name}

                  </label>

                ))}

              </div>

            </div>



            {/* PROFILE IMAGE */}

            <div className="mt-6">

              <label className="block mb-2 font-semibold">

                Profile Image

              </label>

              <input
                type="file"
                className="border p-3 rounded-lg w-full"
                onChange={(e) =>
                  setProfileImage(
                    e.target.files[0]
                  )
                }
              />

            </div>



            {/* BUTTON */}

            <div className="mt-8">

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
              >

                {editId
                  ? "Update Teacher"
                  : "Add Teacher"}

              </button>

            </div>

          </form>



          {/* TABLE */}

          <div className="bg-white p-6 rounded-2xl shadow overflow-y-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-100">

                  <th className="p-3 text-left">
                    Teacher
                  </th>

                  <th className="p-3 text-left">
                    Email
                  </th>

                  <th className="p-3 text-left">
                    Phone
                  </th>

                  <th className="p-3 text-left">
                    Status
                  </th>

                  <th className="p-3 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {teachers
                  .filter((teacher) =>
                    teacher.teacher_name
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  )
                  .map((teacher) => (

                    <tr
                      key={teacher.id}
                      className="border-b"
                    >

                      {/* TEACHER */}

                      <td className="p-3">

                        <div className="flex items-center gap-3">

                          <img
                            src={
                              teacher.image_url ||
                              "https://via.placeholder.com/50"
                            }
                            alt=""
                            className="w-12 h-12 rounded-full object-cover border"
                          />

                          <span className="font-semibold">

                            {teacher.teacher_name}

                          </span>

                        </div>

                      </td>



                      {/* EMAIL */}

                      <td className="p-3">
                        {teacher.email}
                      </td>



                      {/* PHONE */}

                      <td className="p-3">
                        {teacher.phone}
                      </td>



                      {/* STATUS */}

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            teacher.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {teacher.status}
                        </span>

                      </td>



                      {/* ACTION */}

                      <td className="p-3 flex gap-3">

                        <button
                          onClick={() =>
                            navigate(`/teachers/${teacher.id}`)
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >

                          View

                        </button>

                        <button
                          onClick={() =>
                            editTeacher(teacher)
                          }
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                        >

                          Edit

                        </button>

                        <button
                          onClick={() =>
                            deleteTeacher(teacher.id)
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
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

export default Teachers;