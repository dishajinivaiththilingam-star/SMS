import { useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");



  // =========================
  // SEND RESET LINK
  // =========================

  const handleForgotPassword =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          { email }
        );



        Swal.fire({

          icon: "success",

          title: "Success",

          text:
            "Password reset link sent to your email"

        });

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
        onSubmit={handleForgotPassword}
        className="bg-white p-10 rounded-2xl shadow-lg w-[400px]"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">

          Forgot Password

        </h1>



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



        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg"
        >

          Send Reset Link

        </button>

      </form>

    </div>

  );

}

export default ForgotPassword;