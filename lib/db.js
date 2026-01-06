const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async() => {
    const Connection_state = mongoose.connection.readyState;

    if (Connection_state == 1) {
        console.log('Database already connected');
        return;
        
    }

    if (Connection_state == 2) {
        console.log("Loading...");
        return;
    }

    try {
        
        const db = await mongoose.connect(MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME,
            bufferCommands:true,
        })        
        console.log("Database Connected!");
        
    } catch (err) {
        console.log("Error :", err);
        throw new Error('Error :', err);
    }
    
}


export default connect;