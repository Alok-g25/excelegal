import mongoose from 'mongoose';

const enquiryDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    resume:{
        type:String,
        required:true
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

const enquiryDetailsModel = mongoose.models.enquiryDetails || mongoose.model("enquiryDetails", enquiryDetailsSchema);

export default enquiryDetailsModel;