import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    course: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Courses",
    }],
    question: {
        type: String,
        required: true,
    },
    a: {
        type: String,
        required: true
    },
    b: {
        type: String,
        required: true
    },
    c: {
        type: String,
        required: true
    },
    d: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c', 'd'],
    },
    level: {
        type: String,
        required: true,
        enum: ["easy","hard","medium"],
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

const QuestionModel = mongoose.models.Questions || mongoose.model("Questions", questionSchema);

export default QuestionModel;