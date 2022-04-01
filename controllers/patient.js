const { spawn, exec } = require("child_process");

module.exports.getPreliminaryResult = async (req, res) => {
  try {
    const inputs = req.body.inputArray;
    let arg = "python3 ./ml_model/run.py";
    for (let i = 0; i < inputs.length; i++) {
      arg = arg + " " + inputs[i];
    }

    exec(arg, async (err, stdout, stderr) => {
      let output = stdout.toString().trim();
      req.user.patientResults.push({ ...req.body.inputParams, output });
      await req.user.save();

      //(TODO): redirect to the results page later, will change
      return res.status(200).json({
        success: true,
        output,
      });
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      output: 0,
    });
  }
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
