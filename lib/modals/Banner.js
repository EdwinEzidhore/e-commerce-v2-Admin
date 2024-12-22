
const { Schema, model, models } = require('mongoose');

const BannerSchema = new Schema({
    title: {
        type: String,
        required: true,
        
    },
    banner: {
        public_id: {
            type: String,
            
        },
        secure_url: {
            type:String
        }
    },
    createdAt: {
        type: Date,
        default:Date.now,
        
    }
});


const Banner = models.Banner || model("Banner", BannerSchema);

export default Banner;