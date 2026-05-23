const router =
  require("express").Router();

const supabase =
  require("../config/supabase");



// =========================
// GET NOTIFICATIONS
// =========================

router.get(
  "/",
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("notifications")
          .select("*")
          .order(
            "id",
            {
              ascending: false
            }
          );



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
// ADD NOTIFICATION
// =========================

router.post(
  "/",
  async (req, res) => {

    try {

      const {
        title,
        message,
        type
      } = req.body;



      const { data, error } =
        await supabase
          .from("notifications")
          .insert([{

            title,
            message,
            type

          }])
          .select();



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



module.exports = router;