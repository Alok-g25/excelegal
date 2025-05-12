import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    social: {
        provider: {
            type: String,
            required: false,
            enum: ['google', 'facebook'],
        },
        id: {
            type: String,
            required: false,
        }
    },
    name: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: false,
    },
    date_of_birth: {
        type: Date,
        required: false,
    },
    pin_code: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    os: {
        type: String,
        required: true,
        enum: ['android', 'ios'],
    },
    status: {
        type: Boolean,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
});

const StudentModel = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default StudentModel;