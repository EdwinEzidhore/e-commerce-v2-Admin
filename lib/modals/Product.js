import mongoose from "mongoose";
import { model, models, Schema } from "mongoose";


const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product Name is required'],
        minlength: [2, 'Product name should be at least 2 characters long.'],
    },
    description: {
        type: String,
        
    },
    price: {
        type: Number,
        required: [true, 'Product price is required!'],
        min: [0, 'Price must be a positive number.'],
        validate: {
            validator: (value) => value > 0,
            message: 'Price should be greater than 0.',
        },
    },
    type: {
        type: String,
        required: [true, 'Product type is required!']
    },
    size: [
        { type: String, }
    ],
    color: {
        type: String,
    },
    category: {
        type: String,
        required:[true,'Product category is required!']
        
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: '{VALUE} is not a valid status. Allowed values: draft, published, archived.',
        },
        required: [true, 'Product status is required.'],
        
    },
    images: [{
        public_id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        }
    }],
    createdAt: {
        type: Date,
        default:Date.now,
    }
});


const Product = models.Product || model("Product", ProductSchema);

export default Product;