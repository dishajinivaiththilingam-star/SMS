const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");



// =========================
// NODEMAILER SETUP
// =========================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



// =========================
// LOGIN
// =========================

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
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: data.id, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
      admin: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// =========================
// FORGOT PASSWORD
// =========================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // CHECK ADMIN EXISTS IN CUSTOM TABLE
    const { data, error } = await supabase
      .from("admins")
      .select("id, name, email")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "No admin found with this email address",
      });
    }

    // GENERATE JWT RESET TOKEN — valid 15 minutes
    const resetToken = jwt.sign(
      { id: data.id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // RESET LINK — points to ResetPassword page with token in URL
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    // SEND EMAIL VIA NODEMAILER
    await transporter.sendMail({
      from: `"SMS Admin" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Password Reset - Student Management System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px;">
          <div style="background: #2563eb; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Student Management System</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #4b5563;">Hello <strong>${data.name}</strong>,</p>
            <p style="color: #4b5563;">We received a request to reset your password. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}"
                 style="background-color: #2563eb; color: white; padding: 14px 36px;
                        text-decoration: none; border-radius: 8px; font-size: 16px;
                        font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              ⏰ This link will expire in <strong>15 minutes</strong>.
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If you did not request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © SMS Admin — Student Management System
            </p>
          </div>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Password reset link sent to your email",
    });

  } catch (error) {
    console.log("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please check EMAIL_USER and EMAIL_PASS in .env",
    });
  }
};



// =========================
// RESET PASSWORD
// =========================

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    // VERIFY JWT TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Reset link has expired or is invalid. Please request a new one.",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // UPDATE IN DB
    const { data, error } = await supabase
      .from("admins")
      .update({ password: hashedPassword })
      .eq("id", decoded.id)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
      data,
    });

  } catch (error) {
    console.log("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};