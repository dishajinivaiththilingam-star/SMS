const router =
  require("express").Router();

const {

  login,

  forgotPassword,

  resetPassword

} = require(
  "../controllers/authController"
);



// =========================
// LOGIN
// =========================

router.post(
  "/login",
  login
);



// =========================
// FORGOT PASSWORD
// =========================

router.post(
  "/forgot-password",
  forgotPassword
);



// =========================
// RESET PASSWORD
// =========================

router.post(
  "/reset-password",
  resetPassword
);



module.exports =
  router;