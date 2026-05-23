const multer =
  require("multer");

const path =
  require("path");

const fs =
  require("fs");


// =========================
// CREATE UPLOADS FOLDER
// =========================

const uploadPath =
  "uploads";

if (
  !fs.existsSync(uploadPath)
) {

  fs.mkdirSync(
    uploadPath,
    { recursive: true }
  );

}



// =========================
// STORAGE
// =========================

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          uploadPath
        );

      },



    filename:
      function (
        req,
        file,
        cb
      ) {

        const uniqueName =

          Date.now() +

          "-" +

          Math.round(
            Math.random() *
            1E9
          ) +

          path.extname(
            file.originalname
          );



        cb(
          null,
          uniqueName
        );

      }

  });



// =========================
// FILE FILTER
// =========================

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    // IMAGE ONLY

    if (

      file.mimetype.startsWith(
        "image/"
      )

    ) {

      cb(
        null,
        true
      );

    }

    else {

      cb(

        new Error(
          "Only Image Files Allowed"
        ),

        false

      );

    }

  };



// =========================
// UPLOAD
// =========================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      // 5MB
      fileSize:
        5 * 1024 * 1024

    }

  });



// =========================
// EXPORT
// =========================

module.exports =
  upload;