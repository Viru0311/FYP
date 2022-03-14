module.exports.getPreliminaryResult = async (req, res) => {
  //(TODO): Have to integrate ML logic
  const output = 1;

  req.user.patientResults.push({ ...req.body, output });
  await req.user.save();

  //(TODO): redirect to the results page later, will change
  return res.status(200).json({
    success: true,
    output,
  });
};

module.exports.getAllResults = async (req, res) => {
  try {
    const results = req.user.patientResults || [];
    return res.status(200).json({
      success: true,
      results,
    });
  } catch (err) {
    console.log(err);

    return res.status(200).json({
      success: true,
      results,
    });
  }
};
