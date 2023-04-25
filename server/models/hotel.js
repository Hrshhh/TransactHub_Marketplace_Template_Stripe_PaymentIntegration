import mongoose from "mongoose";
import {Schema, ObjectId} from "mongoose";
import User from "./user";

const hotelSchema = new Schema({
    title: {
        type: String,
        required: true,
        description: "Title is required"
    },
    description: {
        type: String,
        required: "Content is required",
        maxLength: 5000
    },
    location: {
        type: String,
    },
    price: {
        type: Number,
        trim: true,
        required: "Price is required"
    },
    bed: {
        type: Number
    },
    postedBy:{
        type: ObjectId,
        ref: User
    },
    image: {
        data: Buffer,
        contentType: String
    },
    to: {
        type: Date
    },
    from: {
        type: Date
    }
}, {timestamps: true})

export default mongoose.model("Hotel", hotelSchema);