import mongoose, { Schema, Document } from "mongoose";

interface user extends Document{
    username:string,
    email:string,
    password:string,
}

const userSchema:Schema<user> = new mongoose.Schema<user>({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type: String,
        required: true,
    }
})

const User = mongoose.models.User as mongoose.Model<user> || mongoose.model<user>("User", userSchema)
export default User;