const router =
  require("express").Router();

const jwt =
  require("jsonwebtoken");

const supabase =
  require("../config/supabase");



// =========================
// STUDENT LOGIN
// =========================

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        student_id,
        phone
      } = req.body;



      // CHECK STUDENT

      const { data, error } =
        await supabase
          .from("students")
          .select("*")
          .eq(
            "student_id",
            student_id
          )
          .eq(
            "phone",
            phone
          )
          .single();



      if (error || !data) {

        return res
          .status(401)
          .json({

            message:
              "Invalid Student ID or Phone"

          });

      }



      // TOKEN

      const token =
        jwt.sign(

          {
            id: data.id,
            role: "student"
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d"
          }

        );



      // RESPONSE

      res.json({

        token,

        student: data

      });

    } catch (error) {

      console.log(error);



      res.status(500).json({

        message:
          "Server Error"

      });

    }

  }
);



// EXPORT

module.exports = router;