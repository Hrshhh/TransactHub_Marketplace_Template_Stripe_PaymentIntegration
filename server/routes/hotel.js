import express from "express";
import formidable from "express-formidable";
import { requireSignIn, checkHotelOwner } from "../middlewares/index";
import { hotels, sellerHotels, removeHotel, singleHotel,updateHotel, userHotelBookings, alreadyBooked, searchingHotels } from "../controllers/hotel";
import { createHotel } from '../controllers/hotel'
import { image } from '../controllers/hotel';

const router = express.Router();

router.post('/create-hotel', requireSignIn, formidable(), createHotel);
router.get('/hotels', hotels);
router.get('/hotel/image/:hotelId', image);
router.get('/seller-hotels', requireSignIn, sellerHotels);
router.delete('/delete-hotel/:hotelId', requireSignIn, checkHotelOwner, removeHotel);
router.get('/hotel/:hotelId', singleHotel);
router.put('/hotel/update-hotel/:hotelId', requireSignIn, checkHotelOwner, formidable(), updateHotel);
router.get('/user-hotel-bookings', requireSignIn, userHotelBookings);
router.get('/already-booked/:hotelId', requireSignIn, alreadyBooked);
router.post('/search-hotel', searchingHotels);

module.exports = router;