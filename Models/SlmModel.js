const mongoose = require('mongoose');

const slmSchema = new mongoose.Schema({
    SLMEmpID: {
        type: String,
        unique: true,
        required: false
    },
    SLMName: {
        type: String,
        required: false
    },
    Password: {
        type: String,
        required: false
    },
    HQ: {
        type: String,
        required: false
    },
    REGION: {
        type: String,
        required: false
    },
    ZONE: {
        type: String,
        required: false
    },
    doc: Date,
    loginLogs: [
        {
            timestamp: {
                type: Date,
                default: Date.now,
            },
            cnt: {
                type: Number,
                required: false,
                default: 0
            },
        },
    ],
    Flm: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Flm' }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Slm', slmSchema);