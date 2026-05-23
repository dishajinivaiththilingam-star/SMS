const express =
  require("express");

const nodemailer =
  require("nodemailer");

const router =
  express.Router();



// =========================
// MAIL CONFIG
// =========================

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,

    },

  });



// =========================
// SEND MAIL
// =========================

router.get(
  "/send-mail",
  async (req, res) => {

    try {

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          "receiver@gmail.com",

        subject:
          "SMS Project Email",

        html:
          `
            <h2>
              Email Working Successfully
            </h2>
          `,

      });



      res.json({

        message:
          "Email Sent Successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Email Failed"

      });

    }

  }
);

module.exports = router;