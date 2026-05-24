import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);



  // =========================
  // AUTO REDIRECT
  // =========================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    // TOKEN IRUNTHA DASHBOARD
    if (token) {

      navigate("/dashboard");

    }

  }, [navigate]);




  // =========================
  // LOGIN FUNCTION
  // =========================

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );



      // =========================
      // SAVE TOKEN
      // =========================

      localStorage.setItem(
        "token",
        res.data.token
      );



      // =========================
      // SAVE ADMIN DATA
      // =========================

      localStorage.setItem(
        "admin",
        JSON.stringify(
          res.data.admin
        )
      );



      // =========================
      // SUCCESS ALERT
      // =========================

      Swal.fire({

        icon: "success",

        title: "Login Successful",

        text: "Welcome Back Admin",

        timer: 2000,

        showConfirmButton: false

      });



      // =========================
      // REDIRECT DASHBOARD
      // =========================

      setTimeout(() => {

        navigate("/dashboard");

      }, 2000);

    } catch (error) {

      console.log(error);

      // =========================
      // ERROR ALERT
      // =========================

      Swal.fire({

        icon: "error",

        title: "Login Failed",

        text:
          error.response?.data?.message ||
          "Invalid Email or Password"

      });

    } finally {

      setLoading(false);

    }

  };




  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[420px]">

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-700">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Student Management System
          </p>

        </div>



        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Email Address

            </label>

            <input
              type="email"
              placeholder="Enter Email Address"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>



          {/* PASSWORD */}

          <div>

            <label className="block mb-2 font-semibold text-gray-700">

              Password

            </label>

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>



          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>


          <div className="text-right mt-3">

  <Link
    to="/forgot-password"
    className="text-blue-600 hover:underline"
  >

    Forgot Password?

  </Link>

</div>

        </form>



        {/* FOOTER */}

        <p className="text-center text-gray-500 text-sm mt-6">

          © 2026 Student Management System

        </p>

      </div>

    </div>

  );

}

export default Login;