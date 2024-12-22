const { Schema, model, models } = require('mongoose');

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required:true
    },
    password: {
        type: String,
        required:true,
    },
    createdAt: {
        type: Date,
        default:Date.now,
        
    }
});


const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;