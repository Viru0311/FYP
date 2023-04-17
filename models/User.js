const mongoose = require("mongoose");

const resultsSchema = mongoose.Schema({
  age: {
    type: Number,
    required: true,
  },

  sex: {
    type: Number,
    required: true,
  },

  cp: {
    type: Number,
    required: true,
  },

  trtbps: {
    type: Number,
    required: true,
  },

  chol: {
    type: Number,
    required: true,
  },

  fbs: {
    type: Number,
    required: true,
  },

  restecg: {
    type: Number,
    required: true,
  },

  thalachh: {
    type: Number,
    required: true,
  },

  oldpeak: {
    type: Number,
    required: true,
  },

  slp: {
    type: Number,
    required: true,
  },

  caa: {
    type: Number,
    required: true,
  },

  thall: {
    type: Number,
    required: true,
  },

  exng: {
    type: Number,
    required: true,
  },

  output: {
    type: Number,
  },

  appliedForConsultation: { Type: Boolean, default: false },

  doctorDiagnosis: {
    output: { type: Number },
    comment: { type: String },
  },
  appliedForPharmacist: {
    type: Boolean,
    default: false,
  },
  approvedByPharmacist: {
    type: Boolean,
    default: false,
  }
});

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },

    userType: {
      type: String,
      enum: ["patient", "doctor", "pharmacist"],
      default: "patient",
    },

    patientResults: { type: [resultsSchema] },

    selectedDoctor: {
      _id: { type: String, default: "" },
      name: { type: String, default: "" },
    },

    patientList: [
      {
        resultId: { type: String, required: true },
        patientId: { type: String, required: true },
        patientName:{type:String},
        verified: { type: Boolean, required: false }
      }
    ],

    // will be accessible for doctors only
    requestedConsultation: [
      {
        patientId: { type: String, required: true },
        patientName: { type: String, required: true },
        patientAge: { type: Number, required: true },
        patientGender: { type: String, required: true },
        modelOutput: { type: Number, required: true },
        resultId: { type: String, required: true },
        verified: { type: Boolean, default: false },
      },
    ],

  },
  {
    toObject: { versionKey: false },
  }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports.Schema = UserSchema;
module.exports.Model = UserModel;
