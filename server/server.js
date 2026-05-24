const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");



// =========================
// ENV
// =========================

dotenv.config();



// =========================
// APP
// =========================

const app = express();



// =========================
// MIDDLEWARES
// =========================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);



// =========================
// HELMET
// =========================

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);


app.use("/uploads", express.static("uploads"));


// =========================
// MORGAN
// =========================

app.use(morgan("dev"));



// =========================
// STATIC FOLDER
// =========================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);



// =========================
// ROUTES
// =========================

const testRoutes =
  require("./routes/testRoutes");

const authRoutes =
  require("./routes/authRoutes");

const courseRoutes =
  require("./routes/courseRoutes");

const studentRoutes =
  require("./routes/studentRoutes");

const attendanceRoutes =
  require("./routes/attendanceRoutes");

const feesRoutes =
  require("./routes/feesRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const profileRoutes =
  require("./routes/profileRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

const timetableRoutes =
  require("./routes/timetableRoutes");

const marksRoutes =
  require("./routes/marksRoutes");

const testMailRoutes =
  require("./routes/testMailRoutes");

  const teacherRoutes =
  require("./routes/teacherRoutes");

  


// =========================
// API ROUTES
// =========================

app.use(
  "/api/test",
  testRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/courses",
  courseRoutes
);

app.use(
  "/api/students",
  studentRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/fees",
  feesRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/timetables",
  timetableRoutes
);

app.use(
  "/api/marks",
  marksRoutes
);

app.use(
  "/api",
  testMailRoutes
);

app.use(
  "/api/teachers",
  teacherRoutes
);


// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {

  res.send(
    "Server Running Successfully"
  );

});



// =========================
// PORT
// =========================

const PORT =
  process.env.PORT || 5000;



// =========================
// SERVER START
// =========================

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});