
const bcrypt = require("bcrypt");

export async function hash_password(password) {
   
    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        return hashed;
    }
    
}