const supabase = require("../config/supabase");



// ======================================
// ADD STUDENT FEES
// ======================================

exports.addFees = async (req, res) => {

  try {

    const {
      student_id,
      course_id,
      total_fee,
      paid_amount
    } = req.body;

    const balance_amount =
      total_fee - paid_amount;

    let payment_status = "Pending";

    if (balance_amount <= 0) {
      payment_status = "Paid";
    }

    const { data, error } = await supabase
      .from("fees")
      .insert([
        {
          student_id,
          course_id,
          total_fee,
          paid_amount,
          balance_amount,
          payment_status
        }
      ])
      .select();

    if (error) {
      return res.status(500).json(error);
    }

    res.status(201).json({
      success: true,
      message: "Fees Added Successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// ======================================
// GET ALL FEES
// ======================================

exports.getFees = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("fees")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};




// ======================================
// UPDATE FEES PAYMENT
// ======================================

exports.updateFees = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      paid_amount
    } = req.body;

    // GET OLD FEES DATA

    const { data: feeData } = await supabase
      .from("fees")
      .select("*")
      .eq("id", id)
      .single();

    const newPaidAmount =
      Number(feeData.paid_amount) +
      Number(paid_amount);

    const balance_amount =
      Number(feeData.total_fee) -
      newPaidAmount;

    let payment_status = "Pending";

    if (balance_amount <= 0) {
      payment_status = "Paid";
    }

    const { data, error } = await supabase
      .from("fees")
      .update({
        paid_amount: newPaidAmount,
        balance_amount,
        payment_status
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json(error);
    }

    res.json({
      success: true,
      message: "Payment Updated Successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};