import mongoose from 'mongoose';

const coursesSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Categories",
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description:{
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

const CoursesModel = mongoose.models.Courses || mongoose.model("Courses", coursesSchema);

export default CoursesModel;