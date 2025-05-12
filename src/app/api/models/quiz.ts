import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Courses",
    },
    level: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
    },
    name: {
        type: String,
        required: true,
    },
    no_of_questions: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    weightage: {
        type: Number,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Questions",
    }],
    status: {
        type: Boolean,
        required: true,
    },
    approval_status: {
        type: String,
        enum: ['APPROVED', 'REJECTED', 'PENDING'],
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const QuizModel = mongoose.models.Quizzes || mongoose.model("Quizzes", quizSchema);

export default QuizModel;