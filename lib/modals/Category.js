
const { Schema, model, models } = require('mongoose');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true,
    },
    sub_category: [
        {
            
            name: {
                type:String
            }
            
        }
    ],
    createdAt: {
        type: Date,
        default:Date.now,
        
    }
});


const Category = models.Category || model("Category", CategorySchema);

export default Category;