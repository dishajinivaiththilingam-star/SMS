import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Profile() {

  const [admin, setAdmin] =
    useState(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [photo, setPhoto] =
    useState(null);



  // =========================
  // GET ADMIN
  // =========================

  const getProfile =
    async () => {

      try {

        const adminData =
          JSON.parse(
            localStorage.getItem(
              "admin"
            )
          );



        const res =
          await axios.get(
            `http://localhost:5000/api/profile/${adminData.id}`
          );



        setAdmin(res.data);

        setName(res.data.name);

        setEmail(res.data.email);

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load profile"
        });

      }

    };



  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile =
    async (e) => {

      e.preventDefault();



      try {

        const formData =
          new FormData();



        formData.append(
          "name",
          name
        );



        formData.append(
          "email",
          email
        );



        if (password) {

          formData.append(
            "password",
            password
          );

        }



        if (photo) {

          formData.append(
            "photo",
            photo
          );

        }



        const adminData =
          JSON.parse(
            localStorage.getItem(
              "admin"
            )
          );



        await axios.put(
          `http://localhost:5000/api/profile/${adminData.id}`,
          formData
        );



        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile Updated Successfully",
          timer: 2000,
          showConfirmButton: false
        });



        getProfile();

        setPassword("");

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Failed to update profile"
        });

      }

    };



  // =========================
  // LOGOUT
  // =========================

  const logout = async () => {

    const result =
      await Swal.fire({

        title: "Logout?",

        text:
          "Are you sure you want to logout?",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        cancelButtonColor: "#3085d6",

        confirmButtonText:
          "Yes, Logout"

      });



    if (!result.isConfirmed)
      return;



    localStorage.removeItem(
      "token"
    );



    localStorage.removeItem(
      "admin"
    );



    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "Logout Successfully",
      timer: 1500,
      showConfirmButton: false
    });



    setTimeout(() => {

      window.location.href = "/";

    }, 1500);

  };



  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    getProfile();

  }, []);




  return (

    <div className="flex">

      <Sidebar />



      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />



        <div className="p-10">

          <h1 className="text-3xl font-bold mb-10">

            Admin Profile

          </h1>



          <div className="bg-white p-10 rounded-xl shadow w-[600px]">

            {/* PHOTO */}

            <div className="flex justify-center mb-5">

              <img
                src={
                  admin?.photo
                    ? `http://localhost:5000/uploads/${admin.photo}`
                    : "https://via.placeholder.com/150"
                }
                alt=""
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
              />

            </div>



            {/* FORM */}

            <form
              onSubmit={updateProfile}
            >

              {/* NAME */}

              <input
                type="text"
                placeholder="Name"
                className="w-full border p-3 rounded mb-5"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />



              {/* EMAIL */}

              <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded mb-5"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />



              



              {/* PHOTO */}

              <input
                type="file"
                className="w-full border p-3 rounded mb-5"
                onChange={(e) =>
                  setPhoto(
                    e.target.files[0]
                  )
                }
              />



              {/* BUTTONS */}

              <div className="flex gap-5">

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                  Update Profile
                </button>



                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700"
                >
                  Logout
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;