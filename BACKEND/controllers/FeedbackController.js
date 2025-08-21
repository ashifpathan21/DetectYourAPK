import Feedback from "../models/Feedback.js";


export const add = async (req , res) => {
     const {rating , text} = req.body ;
     if(!rating || !text){
     return res.status(400).json({
            success:false,
            message:"Rating and Review Required"
        })
     }
     try {
        const feedback = await Feedback.create({rating , text});
        if(!feedback){
             return res.status(500).json({
               success: false,
               message: "Internal Server Error",
             });
        }
        return res.status(200).json({
            success:true,
            message:"Thanks For Your Feeback",
            feedback
        })
     } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
     }

}


export const get = async (req ,res ) => {
    try {
        const feedbacks = await Feedback.find() ;
        return res.status(200).json({
            success:true ,
            feedbacks: feedbacks ? feedbacks : null
        })
    } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
    }
}