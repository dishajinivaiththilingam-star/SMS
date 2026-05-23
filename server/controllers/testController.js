const supabase = require("../config/supabase");

exports.testConnection = async (req, res) => {

  const { data, error } = await supabase
    .from("courses")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};