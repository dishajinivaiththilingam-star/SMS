const router = require("express").Router();

const {
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

// LOGIN
router.post("/login", login);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

// TEMP DEBUG
router.get("/check-admins", async (req, res) => {
  const supabase = require("../config/supabase");
  const { data, error } = await supabase.from("admins").select("id, name, email");
  res.json({ data, error });
});

module.exports = router;