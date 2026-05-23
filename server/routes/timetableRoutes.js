const router =
  require("express").Router();

const supabase =
  require("../config/supabase");



// =========================
// GET TIMETABLES
// =========================

router.get(
  "/",
  async (req, res) => {

    try {

      const { data, error } =
        await supabase
          .from("timetables")
          .select("*")
          .order("id", {
            ascending: false
          });



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
// ADD TIMETABLE
// =========================

router.post(
  "/",
  async (req, res) => {

    try {

      const {

        course_id,
        day,
        start_time,
        end_time

      } = req.body;



      const { data, error } =
        await supabase
          .from("timetables")
          .insert([{

            course_id,
            day,
            start_time,
            end_time

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



// =========================
// DELETE TIMETABLE
// =========================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } =
        req.params;



      const { error } =
        await supabase
          .from("timetables")
          .delete()
          .eq("id", id);



      if (error) {

        return res
          .status(400)
          .json(error);

      }



      res.json({

        message:
          "Deleted Successfully"

      });

    } catch (error) {

      console.log(error);

    }

  }
);



module.exports = router;