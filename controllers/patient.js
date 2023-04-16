const { exec } = require("child_process");
const db = require("../models");

module.exports.getPatientData = async (req, res) => {
  try {
    if (req.user) {
      req.user._doc.patientResults.sort((a, b) => {
        return a._id.getTimestamp() - b._id.getTimestamp();
      });

      let user = { ...req.user._doc, password: null };

      return res.status(200).json({
        success: true,
        user,
      });
    } else throw 2;
  } catch (err) {
    // console.log(err);

    return res.status(200).json({
      success: false,
      message: "Not logged In",
    });
  }
};

module.exports.getPreliminaryResult = async (req, res) => {
  try {
    const inputs = req.body.inputArray;
    let arg = "python3 ./ml_model/run.py";
    for (let i = 0; i < inputs.length; i++) {
      arg = arg + " " + inputs[i];
    }

    exec(arg, async (err, stdout, stderr) => {
      // console.log(err, stderr);

      let output = stdout.toString().trim();
      req.user.patientResults.push({ ...req.body.inputParams, output });
      await req.user.save();

      let user = undefined;

      try {
        if (req.user) {
          req.user._doc.patientResults.sort((a, b) => {
            return a._id.getTimestamp() - b._id.getTimestamp();
          });

          user = { ...req.user._doc, password: null };
        }
      } catch (err) {
        user = undefined;
      }

      return res.status(200).json({
        success: true,
        updatedUser: user,
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

module.exports.updateDoctorPreference = async (req, res) => {
  try {
    req.user.selectedDoctor = req.body;
    await req.user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: true,
    });
  }
};

module.exports.getConsultationByDoctor = async (req, res) => {
  try {
    // _id, name
    const doctorInfo = req.user.selectedDoctor;
    const patientId = req.user._id;
    const patientName = req.user.name;
    const patientAge = req.body.age;
    const patientGender = req.user.gender;
    const modelOutput = req.body.output==null?0:req.body.output;
    const resultId = req.body._id;

    await db.User.updateOne(
      { "patientResults._id": resultId },
      { $set: { "patientResults.$.appliedForConsultation": true } }
    );

    await req.user.save();

    const selectedDoctor = await db.User.findOne({ _id: doctorInfo._id });

    selectedDoctor.requestedConsultation.push({
      patientId,
      patientName,
      patientAge,
      patientGender,
      modelOutput,
      resultId,
      verified: false,
    });

    await selectedDoctor.save();

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
};

module.exports.getReport = async (req, res) => {
  try {
    const patientId = req.query.patientId;
    const resultId = req.query.resultId;

    const patient = await db.User.findOne({ _id: patientId });
    const report = patient.patientResults.filter(function (el) {
      return el._id.toString() === resultId;
    })[0];

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
};

module.exports.choosePharmacist = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patientName = req.user.name;
    const resultId = req.body._id;
    console.log(patientId,patientName,resultId);

    await db.User.updateOne(
      { "patientResults._id": resultId },
      { $set: { "patientResults.$.appliedForPharmacist": true } }
    );

    const resultDetails = await db.User.findOne({
      _id: patientId
    })
   
    const consultation = resultDetails.patientResults.filter((val) => {
      if (val._id == resultId) {
        return true;
      }
      return false;
    })

    await req.user.save();

    const selectedPharmacist = await db.User.findOne({ userType: "pharmacist" });

    if (!selectedPharmacist) {
      return res.status(200).json({
        success: false,
      });
    }

    selectedPharmacist.patientList.push({
      patientId: patientId,
      patientName: patientName,
      // consultation: consultation.doctorDiagnosis.comment,
      resultId: resultId,
      verified: false
    });

    await selectedPharmacist.save();

    return res.status(200).json({
      success: true,
      selectedPharmacist
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
    });
  }
}
