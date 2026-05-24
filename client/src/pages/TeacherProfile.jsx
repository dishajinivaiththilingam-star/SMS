import { useEffect, useState }
  from "react";

import {
  useParams
} from "react-router-dom";

import axios from "axios";

import Sidebar
  from "../components/Sidebar";

import Navbar
  from "../components/Navbar";

function TeacherProfile() {

  const { id } =
    useParams();

  const [teacher, setTeacher] =
    useState(null);



  // =========================
  // GET TEACHER
  // =========================

  const getTeacher =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/teachers"
          );



        const singleTeacher =
          res.data.find(
            (item) =>
              item.id == id
          );



        setTeacher(
          singleTeacher
        );

      } catch (error) {

        console.log(error);

      }

    };



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getTeacher();

  }, []);




  // =========================
  // LOADING
  // =========================

  if (!teacher) {

    return (

      <div className="flex">

        <Sidebar />

        <div className="ml-[250px] w-full min-h-screen bg-gray-100">

          <Navbar />

          <div className="p-10">

            <div className="bg-white rounded-2xl shadow p-10 text-center text-2xl font-semibold">

              Loading...

            </div>

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

          {/* PROFILE CARD */}

          <div className="bg-white rounded-2xl shadow p-10">

            {/* TOP SECTION */}

            <div className="flex flex-col md:flex-row items-center gap-10 border-b pb-10">

              {/* IMAGE */}

              <img
                src={
                  teacher.image_url
                    ? teacher.image_url
                    : `https://ui-avatars.com/api/?name=${teacher.teacher_name}`
                }

                alt="Teacher"

                className="w-44 h-44 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />



              {/* DETAILS */}

              <div className="flex-1">

                <h1 className="text-4xl font-bold text-gray-800 mb-4">

                  {teacher.teacher_name}

                </h1>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* EMAIL */}

                  <div>

                    <p className="text-gray-500 font-semibold">

                      Email

                    </p>

                    <p className="text-lg text-gray-800">

                      {teacher.email || "-"}

                    </p>

                  </div>



                  {/* PHONE */}

                  <div>

                    <p className="text-gray-500 font-semibold">

                      Phone Number

                    </p>

                    <p className="text-lg text-gray-800">

                      {teacher.phone || "-"}

                    </p>

                  </div>



                  {/* GENDER */}

                  <div>

                    <p className="text-gray-500 font-semibold">

                      Gender

                    </p>

                    <p className="text-lg text-gray-800">

                      {teacher.gender || "-"}

                    </p>

                  </div>



                  {/* JOINING DATE */}

                  <div>

                    <p className="text-gray-500 font-semibold">

                      Joining Date

                    </p>

                    <p className="text-lg text-gray-800">

                      {teacher.joining_date || "-"}

                    </p>

                  </div>



                  {/* SALARY */}

                  <div>

                    <p className="text-gray-500 font-semibold">

                      Salary

                    </p>

                    <p className="text-lg text-gray-800">

                      Rs. {teacher.salary || "-"}

                    </p>

                  </div>



                  {/* STATUS */}

                  <div>

                    <p className="text-gray-500 font-semibold mb-2">

                      Status

                    </p>

                    <span
                      className={`px-4 py-2 rounded-full text-white font-semibold ${teacher.status === "Active"
                          ? "bg-green-500"
                          : "bg-red-500"
                        }`}
                    >

                      {teacher.status || "Inactive"}

                    </span>

                  </div>

                </div>

              </div>

            </div>



            {/* QUALIFICATION */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">

                Qualification

              </h2>

              <div className="bg-gray-100 rounded-xl p-5 text-gray-700 leading-8">

                {teacher.qualification || "No Qualification Added"}

              </div>

            </div>



            {/* EXPERIENCE */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">

                Experience

              </h2>

              <div className="bg-gray-100 rounded-xl p-5 text-gray-700 leading-8">

                {teacher.experience || "No Experience Added"}

              </div>

            </div>



            {/* ADDRESS */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">

                Address

              </h2>

              <div className="bg-gray-100 rounded-xl p-5 text-gray-700 leading-8">

                {teacher.address || "No Address Added"}

              </div>

            </div>



            {/* COURSES */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-gray-800 mb-5">

                Assigned Courses

              </h2>



              <div className="flex flex-wrap gap-3">

                {teacher.courses
                  ?.split(",")
                  .map((course, index) => (

                    <span
                      key={index}
                      className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium"
                    >

                      {course}

                    </span>

                  ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default TeacherProfile;