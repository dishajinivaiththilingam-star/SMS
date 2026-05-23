const router = require("express").Router();

const {
  testConnection,
} = require("../controllers/testController");

router.get("/", testConnection);

module.exports = router;