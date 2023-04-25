import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ConnectNav from "../ConnectNav";
import DashBoardNav from "./DashBoardNav";
import axios from "axios";
import UserHotelBookings from "./UserHotelBookings";

const DashBoard = () => {
    const [bookings, setBookings] = useState([]);
    const {redux_auth: {token}} = useSelector((state) => ({...state}));

    useEffect(() => {
        loadUserHotels();
    },[]);

    const loadUserHotels = async(req, res) => {
        try{
            await axios.get(`http://localhost:8001/api/user-hotel-bookings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            // console.log("User Bookings",response);
            setBookings(response.data);
        })
        }catch(err){
            console.log("Error occurred ", err);
        }
    }

    return(
        <>
        <div className="card w-75 mx-auto p-5 bg-warning text-center">
            <ConnectNav />
        </div>
        <div className="container-fluid p-4">
            <DashBoardNav />
        </div>
        
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-10"> 
                    {bookings.map((book) => (
                        <UserHotelBookings 
                            key={book._id}
                            hotel={book.hotel}
                            session={book.session}
                            orderedBy={book.orderedBy}
                        /> 
                    ))}
                    
                    {/* <pre>{JSON.stringify(bookings, null, 1)}</pre> */}
                </div>
                <div className="col-md-2">
                    <Link to="/" className="btn btn-primary">Browse Products</Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default DashBoard;