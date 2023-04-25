import Hotel from "../models/hotel";
import Order from "../models/order";
import fs from "fs";

export const createHotel = async(req, res) => {
    try{
        let fields = req.fields;
        let files = req.files;

        let hotel = new Hotel(fields);
        // console.log("uih ",req.auth._id);
        hotel.postedBy = req.auth._id;
        if(files.image){
            hotel.image.data = fs.readFileSync(files.image.path);
            hotel.image.contentType = files.image.type;
        }
        hotel.save((err, result) => {
            if(err){
                console.log("Saving hotel err ", err);
                res.status(400).send("Error in saving the hotel data");
            }
            console.log(result);
            res.json(result);
        })

    }
    catch(err){
        console.log(err);
        res.status(400).json({
            err: err.message
        })
    }
}

export const hotels = async(req, res) => {
    let all = await Hotel.find({from : {$gte: new Date()}}) //{from : {$gte: new Date()}} Available from date greater than current date
    .limit(20)
    .select("-image.data")
    .exec();
    console.log(all);
    res.json(all);
}

export const image = async(req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    if(hotel && hotel.image && hotel.image.data !== null ){
        res.set("Content-Type", hotel.image.contentType);
        return res.send(hotel.image.data)
    }
}

export const sellerHotels = async(req,res) => {
    let all = await Hotel.find({postedBy: req.auth._id}).select("-image.data").populate('postedBy', '_id name').exec();

    // console.log(all);
    res.send(all);
}

export const removeHotel = async(req, res) => {
    console.log("Hi");
    let deleted = await Hotel.findByIdAndDelete(req.params.hotelId).select("-image.data");
    res.send(deleted);
}

export const singleHotel = async(req, res) => {
    let singleHotel = await Hotel.findById(req.params.hotelId).populate("postedBy", "_id name").select("-image.data");
    res.send(singleHotel);
}

export const updateHotel = async(req, res) => {

    try{
    let fields = req.fields;
    let files = req.files;

    let data = {...fields}
    if(files.image){
        let image = {};
        image.data = fs.readFileSync(files.image.path);
        image.contentType = files.image.type;

        data.image = image;
    }

    console.log(data);
    await Hotel.findByIdAndUpdate(req.params.hotelId, data, {new: true}).select('-image.data').then((response) => {
        console.log(response);
        res.json(response);
    })
    // let files = 
    // console.log("jyvg",hotel);
    }catch(err){
        console.log(err);
        res.status(400).send("Updation of Hotel failed. See again");
    }

}

export const userHotelBookings = async(req, res) => {
    const allBookings = await Order.find({ orderedBy: req.auth._id }).select("session").populate("hotel", "-image.data").populate("orderedBy", "_id name").exec();

    res.json(allBookings);
}

export const alreadyBooked = async(req, res) => {
    const {hotelId} = req.params;

    // Finding orders of currently logged in user 
    const userOrders = await Order.find({orderedBy: req.auth._id}).select("hotel");
    let ids = [];

    for(let i = 0; i< userOrders.length; i++){
        ids.push(userOrders[i].hotel.toString());
    }

    res.json({
        ok: ids.includes(hotelId),
    })
}

export const searchingHotels = async(req, res) => {
    console.log("Search hotels>> ",req.body);
    const {location, date, bed} = req.body;
    const fromDate = date.split(",")[0];
    console.log("From date>> ", fromDate);
    let result = await Hotel.find({ from: {$gte: new Date(fromDate)}, location}).select("-image.data").exec();

    res.json(result);
}