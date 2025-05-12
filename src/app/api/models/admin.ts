import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
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
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'STAFF']
    },
    subRole:{
        type: String,
        required: true,
        enum: ['EXAMINER', 'TEACHER']
    },
    status: {
        type: Boolean,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const AdminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default AdminModel;