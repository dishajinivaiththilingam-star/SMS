const router =
  require("express").Router();

const {

  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher

} = require(
  "../controllers/teacherController"
);

const upload =
  require("../middleware/upload");


// ADD TEACHER

router.post(
  "/",
  upload.single("profile_image"),
  addTeacher
);


// GET TEACHERS

router.get(
  "/",
  getTeachers
);


// UPDATE TEACHER

router.put(
  "/:id",
  upload.single("profile_image"),
  updateTeacher
);


// DELETE TEACHER

router.delete(
  "/:id",
  deleteTeacher
);

module.exports = router;