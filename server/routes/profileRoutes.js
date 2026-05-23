const router =
  require("express").Router();

const supabase =
  require("../config/supabase");

const upload =
  require("../middleware/upload");



// =========================
// GET ADMIN PROFILE
// =========================

router.get(
  "/:id",
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const { data, error } =
        await supabase
          .from("admins")
          .select("*")
          .eq("id", id)
          .single();



      if (error) {

        return res
          .status(400)
          .json(error);

      }



      res.json(data);

    } catch (error) {

      console.log(error);

    }

  }
);



// =========================
// UPDATE PROFILE
// =========================

router.put(
  "/:id",
  upload.single("photo"),
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const {
        name,
        email,
        password
      } = req.body;



      let updateData = {

        name,
        email

      };



      // PASSWORD

      if (password) {

        updateData.password =
          password;

      }



      // PHOTO

      if (req.file) {

        updateData.photo =
          req.file.filename;

      }



      const { data, error } =
        await supabase
          .from("admins")
          .update(updateData)
          .eq("id", id)
          .select();



      if (error) {

        return res
          .status(400)
          .json(error);

      }



      res.json({

        message:
          "Profile Updated Successfully",

        data

      });

    } catch (error) {

      console.log(error);

    }

  }
);



module.exports = router;