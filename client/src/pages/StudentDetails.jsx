import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StudentDetails() {

  const { id } = useParams();

  const [student, setStudent] =
    useState(null);

  const [courseName, setCourseName] =
    useState("");



  // =========================
  // GET STUDENT
  // =========================

  const getStudent = async () => {

    try {

      const res =
        await axios.get(
          `http://localhost:5000/api/students/${id}`
        );

      const studentData =
        res.data;

      setStudent(studentData);



      // COURSE NAME

      if (studentData.course_id) {

        const courseRes =
          await axios.get(
            "http://localhost:5000/api/courses"
          );

        const course =
          courseRes.data.find(
            (c) =>
              c.id == studentData.course_id
          );

        setCourseName(
          course?.course_name || ""
        );

      }

    } catch (error) {

      console.log(error);

    }

  };



  useEffect(() => {

    getStudent();

  }, []);




  if (!student) {

    return (
      <div className="p-10">
        Loading...
      </div>
    );

  }




  return (

    <div className="flex">

      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />

        <div className="p-10">

          {/* HEADER */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <div className="flex items-center gap-8">

              <img
                src={
                  student.image_url
                    ? student.image_url
                    : `https://ui-avatars.com/api/?name=${student.student_name}`
                }

                alt="Student"

                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
              />



              <div>

                <h1 className="text-4xl font-bold text-black mb-3">
                  {student.student_name}
                </h1>

                <p className="text-lg text-gray-600">
                  Student ID :
                  <span className="font-semibold ml-2">
                    {student.student_id}
                  </span>
                </p>

                <p className="text-lg text-gray-600">
                  Course :
                  <span className="font-semibold ml-2">
                    {courseName}
                  </span>
                </p>

              </div>

            </div>

          </div>



          {/* PERSONAL DETAILS */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Personal Details
            </h2>

            <div className="grid grid-cols-3 gap-6">

              <Detail
                label="Student Name"
                value={student.student_name}
              />

              <Detail
                label="Email"
                value={student.email}
              />

              <Detail
                label="Phone"
                value={student.phone}
              />

              <Detail
                label="NIC"
                value={student.nic}
              />

              <Detail
                label="Gender"
                value={student.gender}
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

            <h2 className="text-2xl font-bold text-green-700 mb-6">
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

            <h2 className="text-2xl font-bold text-purple-700 mb-6">
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



          {/* EDUCATION DETAILS */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

            <h2 className="text-2xl font-bold text-orange-700 mb-6">
              Education Details
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

    <div className="bg-gray-50 border rounded-xl p-4">

      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-lg font-semibold text-black break-words">
        {value || "-"}
      </p>

    </div>

  );

}



export default StudentDetails;