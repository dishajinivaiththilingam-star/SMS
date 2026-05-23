const router =
  require("express").Router();

const {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse
} = require(
  "../controllers/courseController"
);



// =========================
// ADD COURSE
// =========================

router.post(
  "/",
  addCourse
);



// =========================
// GET COURSES
// =========================

router.get(
  "/",
  getCourses
);



// =========================
// UPDATE COURSE
// =========================

router.put(
  "/:id",
  updateCourse
);



// =========================
// DELETE COURSE
// =========================

router.delete(
  "/:id",
  deleteCourse
);



// =========================
// EXPORT
// =========================

module.exports = router;