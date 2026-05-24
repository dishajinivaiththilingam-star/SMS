const router =
  require("express").Router();

const {

  login,

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
// RESET PASSWORD
// =========================

router.post(
  "/reset-password",
  resetPassword
);



module.exports =
  router;