import { useEffect, useState } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";



function StudentView() {

  // =========================
  // PARAMS
  // =========================

  const { id } = useParams();



  // =========================
  // STATE
  // =========================

  const [student, setStudent] =
    useState(null);



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
  // LOAD
  // =========================

  useEffect(() => {

    getStudent();

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




  return (

    <div className="flex">

      <Sidebar />

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />

        <div className="p-10">

          {/* HEADER */}

          <div className="bg-white rounded-2xl shadow p-8 mb-8">

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

                  Course ID :
                  <span className="font-semibold ml-2">
                    {student.course_id}
                  </span>

                </p>

                <p className="text-lg text-gray-600">

                  Email :
                  <span className="font-semibold ml-2">
                    {student.email}
                  </span>

                </p>

              </div>

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



          {/* AGREEMENT */}

          
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