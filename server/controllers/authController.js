const supabase =
  require("../config/supabase");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");



// =========================
// LOGIN
// =========================

exports.login =
  async (req, res) => {

    try {

      const {

        email,
        password

      } = req.body;



      // =========================
      // CHECK ADMIN
      // =========================

      const { data, error } =
        await supabase
          .from("admins")
          .select("*")
          .eq("email", email)
          .single();



      if (error || !data) {

        return res.status(404).json({

          success: false,

          message:
            "Admin not found"

        });

      }



      // =========================
      // PASSWORD CHECK
      // =========================

      const isMatch =
        await bcrypt.compare(
          password,
          data.password
        );



      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Password"

        });

      }



      // =========================
      // JWT TOKEN
      // =========================

      const token =
        jwt.sign(

          {

            id: data.id,

            role: data.role

          },

          process.env.JWT_SECRET,

          {

            expiresIn: "7d"

          }

        );



      // =========================
      // RESPONSE
      // =========================

      res.json({

        success: true,

        message:
          "Login Successful",

        token,

        admin: {

          id: data.id,

          name: data.name,

          email: data.email,

          role: data.role

        }

      });

    } catch (error) {

      console.log(error);



      res.status(500).json({

        success: false,

        message:
          error.message

      });

    }

  };







// =========================
// RESET PASSWORD
// =========================

exports.resetPassword =
  async (req, res) => {

    try {

      const {

        email,
        password

      } = req.body;



      // =========================
      // HASH PASSWORD
      // =========================

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );



      // =========================
      // UPDATE PASSWORD
      // =========================

      const { data, error } =
        await supabase
          .from("admins")
          .update({

            password:
              hashedPassword

          })
          .eq("email", email)
          .select();



      if (error) {

        return res.status(400).json({

          success: false,

          message:
            error.message

        });

      }



      res.json({

        success: true,

        message:
          "Password Updated Successfully",

        data

      });

    } catch (error) {

      console.log(error);



      res.status(500).json({

        success: false,

        message:
          "Server Error"

      });

    }

  };