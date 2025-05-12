import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
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

const BannerModel = mongoose.models.Banners || mongoose.model("Banners", bannerSchema);

export default BannerModel;