import { useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

import {
  useNavigate
} from "react-router-dom";

function ForgotPassword() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");



  // =========================
  // RESET PASSWORD
  // =========================

  const handleResetPassword =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(
          "http://localhost:5000/api/auth/reset-password",
          {

            email,

            password

          }
        );



        Swal.fire({

          icon: "success",

          title: "Success",

          text:
            "Password Changed Successfully"

        });



        navigate("/");

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



  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleResetPassword}
        className="bg-white p-10 rounded-2xl shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">

          Reset Password

        </h1>



        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter Email"
          className="border p-3 rounded-lg w-full mb-5"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />



        {/* NEW PASSWORD */}

        <input
          type="password"
          placeholder="Enter New Password"
          className="border p-3 rounded-lg w-full mb-5"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />



        {/* BUTTON */}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg"
        >

          Change Password

        </button>

      </form>

    </div>

  );

}

export default ForgotPassword;