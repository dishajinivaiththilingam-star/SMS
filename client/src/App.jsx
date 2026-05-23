import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";


function App() {

  // =========================
  // STATES
  // =========================

  const [dashboard, setDashboard] =
    useState({

      totalStudents: 0,

      totalCourses: 0,

      totalFees: 0,

      attendancePercentage: 0

    });



  // =========================
  // CHART DATA
  // =========================

  const chartData = [

    {
      name: "Students",
      value:
        dashboard.totalStudents
    },

    {
      name: "Courses",
      value:
        dashboard.totalCourses
    },

    {
      name: "Attendance",
      value: Number(
        dashboard.attendancePercentage
      )
    }

  ];



  // =========================
  // PIE COLORS
  // =========================

  const COLORS = [

    "#3b82f6",

    "#10b981",

    "#f59e0b"

  ];



  // =========================
  // GET DASHBOARD DATA
  // =========================

  const getDashboardData =
    async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/dashboard"
        );

      setDashboard(res.data);

    } catch (error) {

      console.log(error);

    }

  };



  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    getDashboardData();

  }, []);




  return (

    <div className="flex">

      {/* SIDEBAR */}

      <Sidebar />



      {/* MAIN CONTENT */}

      <div className="ml-[250px] w-full min-h-screen bg-gray-100">

        <Navbar />



        {/* PAGE */}

        <div className="p-10">

          {/* TITLE */}

          <h1 className="text-4xl font-bold">

            Dashboard

          </h1>



          {/* DASHBOARD CARDS */}

          <div className="grid grid-cols-4 gap-5 mt-10">

            {/* STUDENTS */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold">

                Total Students

              </h2>

              <p className="text-3xl mt-3 font-bold text-blue-600">

                {
                  dashboard.totalStudents
                }

              </p>

            </div>



            {/* COURSES */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold">

                Total Courses

              </h2>

              <p className="text-3xl mt-3 font-bold text-green-600">

                {
                  dashboard.totalCourses
                }

              </p>

            </div>



            {/* ATTENDANCE */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold">

                Attendance

              </h2>

              <p className="text-3xl mt-3 font-bold text-purple-600">

                {
                  dashboard.attendancePercentage
                }%

              </p>

            </div>



            {/* FEES */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold">

                Fees Collection

              </h2>

              <p className="text-3xl mt-3 font-bold text-red-600">

                Rs.
                {
                  dashboard.totalFees
                }

              </p>

            </div>

          </div>



          {/* CHARTS */}

          <div className="grid grid-cols-2 gap-5 mt-10">

            {/* BAR CHART */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold mb-5">

                Dashboard Analytics

              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={chartData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#2563eb"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>



            {/* PIE CHART */}

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold mb-5">

                System Overview

              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    {chartData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>



          {/* EXTRA SUMMARY */}

          <div className="grid grid-cols-3 gap-5 mt-10">

            {/* STUDENT CARD */}

            <div className="bg-blue-600 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Students

              </h2>

              <p className="text-5xl mt-4">

                {
                  dashboard.totalStudents
                }

              </p>

            </div>



            {/* COURSE CARD */}

            <div className="bg-green-600 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Courses

              </h2>

              <p className="text-5xl mt-4">

                {
                  dashboard.totalCourses
                }

              </p>

            </div>



            {/* FEES CARD */}

            <div className="bg-red-600 text-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold">

                Total Fees

              </h2>

              <p className="text-4xl mt-4">

                Rs.
                {
                  dashboard.totalFees
                }

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default App;