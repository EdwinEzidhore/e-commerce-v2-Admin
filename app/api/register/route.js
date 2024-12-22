import { hash_password } from "@/helper/password_hash";
import connect from "@/lib/db";
import Admin from "@/lib/modals/Admin";
import { NextResponse } from "next/server";

export async function POST(req) {
   
    const data = await req.json();
    const { fullName, email, password } = data;
        
    
    await connect(); //Databse Connetion

    if (!fullName || !email || !password) {
        return NextResponse.json({ message: "Invalid data passed!" }, { status: 400 });
    }
    
    try {
        const isExisting = await Admin.findOne({ email });
        if (isExisting) {
            return NextResponse.json({ message: "User already exists!"},{status:409});
        } else {
            const hashed_password = await hash_password(password);
            const new_User = new Admin({
                name: fullName,
                email: email,
                password:hashed_password,
            })

            await new_User.save();
            return NextResponse.json({ success: true, message: "New Admin Account Created!" },{status: 201});
            
        }

        
        
    } catch (error) {
        return NextResponse.json({ message: "Internal server error"},{status: 500 });
    }
    
}