import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Courses",
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
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

const TopicModel = mongoose.models.Topics || mongoose.model("Topics", topicSchema);

export default TopicModel;