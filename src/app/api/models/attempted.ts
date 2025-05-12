import mongoose from 'mongoose';

const attemptedSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Quizzes",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Courses",
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Questions",
    },
    selected_answer: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c', 'd'],
    },
    time: {
        start: {
            type: Date,
            required: false,
        },
        end: {
            type: Date,
            required: false,
        },
    },
    progress: {
        type: String,
        required: true,
        enum: ['pending', 'success'],
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

const AttemptedModel = mongoose.models.Attempted || mongoose.model("Attempted", attemptedSchema);

export default AttemptedModel;