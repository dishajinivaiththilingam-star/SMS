const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const isMatch = password === "123456";

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: data.id,
        role: data.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: data.id,
        name: data.name,
        email: data.email
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};