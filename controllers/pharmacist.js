const db = require("../models");

module.exports.showPatients = async (req, res) => {
  try {
    const pharmacist = await db.User.findOne({
      userType: "pharmacist",
    })
    const data = [];
    pharmacist.patientList.map((val, ind) => {
      if (val.verified === false) {
        data.push({
          patientId: val.patientId,
          patientName: val.patientName,
          resultId:val.resultId
          // consultation: val.consultation
        })
      }
    })
    console.log(data);
    if (data.length < 1) {
      return res.status(400).json({
        success: true,
        message: "No patient has applied"
      })
    }
    return res.status(200).json({
      success: true,
      data
    })

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

module.exports.approvePatient = async (req, res) => {
  try {
    const patientId = req.body.patientId;
    const resultId = req.body.resultId;
    console.log(patientId,resultId);
    const currentPatient = await db.User.findOne({
      _id: patientId,
    });
    if (!currentPatient) {
      return res.status(400).jsonp({
        success: false,
        message: "User not found"
      })
    }
    currentPatient.patientResults.map((val) => {
      if (val._id == resultId) {
        val.appliedForPharmacist = true;
        return true;
      }
      return false;
    });
    await currentPatient.save();
    const pharmacist = await db.User.findOne({
      userType: 'pharmacist'
    });
    if (!pharmacist) {
      return res.status(400).jsonp({
        success: false,
        message: "Pharmacist not found"
      })
    }
    pharmacist.patientList.map((val) => {
      if(val.resultId==resultId && val.patientId==patientId){
        val.verified=true;
      }
      return true;
    })
    await pharmacist.save();
    return res.status(200).json({
      success:true
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
}

module.exports.passFinalVerdict = async (req, res) => {
  try {
    const { patientId, resultId, consult, doctorVerdict } = req.body;

    await db.User.updateOne(
      { "patientResults._id": resultId },
      {
        $set: {
          "patientResults.$.doctorDiagnosis": {
            output: doctorVerdict,
            comment: consult,
          },
        },
      }
    );

    for (let i = 0; i < req.user.requestedConsultation.length; i++) {
      if (req.user.requestedConsultation[i].resultId === resultId) {
        req.user.requestedConsultation[i].verified = true;
      }
    }

    req.user.save();

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: "Not logged In",
    });
  }
};
