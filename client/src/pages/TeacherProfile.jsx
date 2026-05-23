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



  useEffect(() => {

    getTeacher();

  }, []);




  if (!teacher) {

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

          <div className="bg-white rounded-2xl shadow p-10">

            {/* IMAGE */}

            <div className="flex items-center gap-8">

              <img
                src={
                  teacher.image_url
                    ? teacher.image_url
                    : `https://ui-avatars.com/api/?name=${teacher.teacher_name}`
                }

                alt="Teacher"

                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
              />



              <div>

                <h1 className="text-4xl font-bold mb-3">

                  {teacher.teacher_name}

                </h1>



                <p className="text-gray-600 text-lg">

                  {teacher.email}

                </p>



                <p className="text-gray-600 text-lg">

                  {teacher.phone}

                </p>

              </div>

            </div>



            {/* COURSES */}

            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-5">

                Assigned Courses

              </h2>



              <div className="flex flex-wrap gap-3">

                {teacher.courses
                  ?.split(",")
                  .map((course, index) => (

                    <span
                      key={index}
                      className="bg-blue-600 text-white px-5 py-2 rounded-full"
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