const mongoose = require("mongoose");

const Pharmacy = mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
            default: ""
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

        doctorClientPair: [
            {
                patient_id: {
                    type: mongoose.Types.ObjectId, ref: 'user'
                }
            }
        ],
    },
    {
        toObject: { versionKey: false },
    }
);

const PharmacyModel = mongoose.model("pharmacy", Pharmacy);
module.exports.Model = PharmacyModel;