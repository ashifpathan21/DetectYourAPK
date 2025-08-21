import mongoose from "mongoose" ;

const feedbackSchema = new mongoose.Schema({
    rating:{
        type:Number,
        required:true,
        min:0,
        max:5
    },
    text:{
        type:String,
        required:true
    }
})

export default mongoose.model("Feedback" , feedbackSchema) ;