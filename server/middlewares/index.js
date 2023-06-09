import Hotel from "../models/hotel";

var { expressjwt: jwt } = require("express-jwt");
export const requireSignIn = jwt({
    
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})

export const checkHotelOwner = async(req, res, next) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    // console.log(hotel.postedBy._id.toString());
    // console.log(req.auth._id.toString());
    let owner = hotel.postedBy._id.toString() === req.auth._id.toString();
    if(!owner){
        return res.status(403).send("Unauthorized");
    }
    next();
}