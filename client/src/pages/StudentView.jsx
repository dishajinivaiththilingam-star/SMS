import { useEffect, useState } from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";



function StudentView() {

  // =========================
  // PARAMS
  // =========================

  const { id } = useParams();

  const navigate = useNavigate();



  // =========================
  // STATE
  // =========================

  const [student, setStudent] =
    useState(null);

  const [courses, setCourses] =
    useState([]);




  // =========================
  // GET STUDENT
  // =========================

  const getStudent = async () => {

    try {

      const res =
        await axios.get(
          `http://localhost:5000/api/students/${id}`
        );

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

      const res = await axios.get(
        "http://localhost:5000/api/courses"
      );

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



    // MULTIPLE COURSES

    if (
      student.course_ids &&
      Array.isArray(student.course_ids)
    ) {

      ids = student.course_ids;

    }



    // STRING JSON

    else if (
      typeof student.course_ids === "string"
    ) {

      try {

        ids = JSON.parse(student.course_ids);

      } catch {

        ids = [];

      }
    }



    // SINGLE COURSE

    else if (student.course_id) {

      ids = [student.course_id];

    }



    return ids
      .map((cid) =>
        courses.find(
          (c) => String(c.id) === String(cid)
        )?.course_name
      )
      .filter(Boolean);
  };



  // =========================
  // DELETE STUDENT
  // =========================

  const handleDelete = async () => {

    const result = await Swal.fire({

      title: "Are you sure?",

      text: "Student will be deleted permanently",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#d33",

      cancelButtonColor: "#3085d6",

      confirmButtonText: "Yes, Delete",

    });



    if (result.isConfirmed) {

      try {

        await axios.delete(
          `http://localhost:5000/api/students/${id}`
        );



        Swal.fire({

          icon: "success",

          title: "Deleted",

          text: "Student Deleted Successfully",

          timer: 2000,

          showConfirmButton: false,

        });



        navigate("/student-list");

      } catch (error) {

        console.log(error);



        Swal.fire({

          icon: "error",

          title: "Error",

          text: "Delete Failed",

        });

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

        <div className="ml-[250px] w-full min-h-screen bg-gray-100">

          <Navbar />

          <div className="p-10">

            <h1 className="text-2xl font-bold">
              Loading...
            </h1>

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

          {/* HEADER */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <div className="flex justify-between items-start">

              <div className="flex items-center gap-8">

                {/* IMAGE */}

                <img
                  src={
                    student.image_url
                      ? student.image_url
                      : `https://ui-avatars.com/api/?name=${student.student_name}`
                  }

                  alt="Student"

                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                />



                {/* BASIC DETAILS */}

                <div>

                  <h1 className="text-4xl font-bold text-gray-800 mb-3">

                    {student.student_name}

                  </h1>

                  <p className="text-lg text-gray-600 mb-2">

                    Student ID :

                    <span className="font-semibold ml-2">

                      {student.student_id}

                    </span>

                  </p>



                  <p className="text-lg text-gray-600 mb-2">

                    Email :

                    <span className="font-semibold ml-2">

                      {student.email}

                    </span>

                  </p>



                  {/* COURSES */}

                  <div className="mt-4">

                    <p className="text-lg text-gray-600 mb-2">

                      Courses :

                    </p>



                    <div className="flex flex-wrap gap-2">

                      {courseNames.length > 0 ? (

                        courseNames.map(
                          (course, index) => (

                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold"
                            >
                              {course}
                            </span>

                          )
                        )

                      ) : (

                        <span className="text-gray-500">
                          No Courses
                        </span>

                      )}

                    </div>

                  </div>

                </div>

              </div>



              {/* ACTION BUTTONS */}

              {/* <div className="flex gap-4">

                <button
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Edit
                </button>



                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Delete
                </button>

              </div> */}

            </div>

          </div>



          {/* PERSONAL DETAILS */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-3">

              Personal Details

            </h2>

            <div className="grid grid-cols-3 gap-6">

              <Detail
                label="Student Name"
                value={student.student_name}
              />

              <Detail
                label="Phone Number"
                value={student.phone}
              />

              <Detail
                label="Gender"
                value={student.gender}
              />

              <Detail
                label="NIC Number"
                value={student.nic}
              />

              <Detail
                label="Date of Birth"
                value={student.dob}
              />

              <Detail
                label="Occupation"
                value={student.occupation}
              />

              <Detail
                label="Course Type"
                value={student.course_type}
              />

              <Detail
                label="Admission Date"
                value={student.admission_date}
              />

            </div>

          </div>



          {/* CONTACT DETAILS */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold text-purple-700 mb-6 border-b pb-3">

              Contact Details

            </h2>

            <div className="grid grid-cols-2 gap-6">

              <Detail
                label="Permanent Address"
                value={student.permanent_address}
              />

              <Detail
                label="Current Address"
                value={student.current_address}
              />

              <Detail
                label="District"
                value={student.district}
              />

              <Detail
                label="Home Phone"
                value={student.home_phone}
              />

            </div>

          </div>



          {/* FAMILY DETAILS */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">

              Family Details

            </h2>

            <div className="grid grid-cols-3 gap-6">

              <Detail
                label="Father Name"
                value={student.father_name}
              />

              <Detail
                label="Mother Name"
                value={student.mother_name}
              />

              <Detail
                label="Father Phone"
                value={student.father_phone}
              />

              <Detail
                label="Mother Phone"
                value={student.mother_phone}
              />

              <Detail
                label="Father Occupation"
                value={student.father_occupation}
              />

              <Detail
                label="Mother Occupation"
                value={student.mother_occupation}
              />

              <Detail
                label="Monthly Income"
                value={student.monthly_income}
              />

              <Detail
                label="Guardian Name"
                value={student.guardian_name}
              />

              <Detail
                label="Guardian Phone"
                value={student.guardian_phone}
              />

            </div>

          </div>



          {/* ACADEMIC DETAILS */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold text-orange-700 mb-6 border-b pb-3">

              Academic Qualifications

            </h2>

            <div className="grid grid-cols-2 gap-6">

              <Detail
                label="School Name"
                value={student.school_name}
              />

              <Detail
                label="Education Year"
                value={student.education_year}
              />

              <Detail
                label="Qualification"
                value={student.qualification}
              />

              <Detail
                label="Exam Results"
                value={student.exam_results}
              />

              <Detail
                label="Other Qualifications"
                value={student.other_qualifications}
              />

            </div>

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

    <div className="bg-gray-50 p-5 rounded-xl border">

      <p className="text-sm text-gray-500 mb-2">
        {label}
      </p>

      <p className="text-lg font-semibold text-gray-800">

        {value || "-"}

      </p>

    </div>  

  );

}



export default StudentView;