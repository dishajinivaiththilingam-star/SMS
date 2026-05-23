const router = require("express").Router();

const {
  addFees,
  getFees,
  updateFees
} = require("../controllers/feesController");



// ADD FEES
router.post("/", addFees);


// GET FEES
router.get("/", getFees);


// UPDATE FEES PAYMENT
router.put("/:id", updateFees);


module.exports = router;