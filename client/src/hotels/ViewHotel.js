import React, {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom"; 
import {loadStripe} from '@stripe/stripe-js';

const ViewHotel = ({match}) => {
    const [hotel, setHotel] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [alreadyBooked, setAlreadyBooked] = useState(false);

    const {redux_auth} = useSelector((state) => ({...state}));
    const history = useHistory();

    useEffect(() => {
        viewHotels();
    }, [])

    const viewHotels = async() => {
        let path = match.params.hotelId;
        await axios.get(`http://localhost:8001/api/hotel/${path}`)
        .then((response) => {
            console.log("View Hotel", response.data);
            setHotel(response.data);
            setImage(`http://localhost:8001/api/hotel/image/${response.data._id}`);
        })
    }

    useEffect(() => {
        alreadyBookedHotels();
    }, [])

    const alreadyBookedHotels = async() => {
        if(redux_auth && redux_auth.token){
            let path = match.params.hotelId;
            await axios.get(`http://localhost:8001/api/already-booked/${path}`,{
                headers: {
                    Authorization: `Bearer ${redux_auth.token}`,
                }
            })
            .then((response) => {
                if(response.data.ok){
                    setAlreadyBooked(true);
                }
            })
        }
    }

    const diffDays = (from, to) => {
        const millisec = 24*60*60*1000
        const start = new Date(from);
        const end = new Date(to);

        return Math.round(Math.abs((start -end)/ millisec));
    }

    // const handleClick = (event) => {
    //     event.preventDefault();
    //     if(!redux_auth){
    //         history.push('/login');
    //     }
    //     console.log("Get session Id from Stripe to show a button > Checkout with stripe")
    // }

    return(
        <>
            <div className="card w-75 mx-auto mb-3 bg-purple p-5 text-center">
                <h2>{hotel.title}</h2>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <br />
                        <img src={image} alt={hotel.title}  width="450" className="img img-fluid"/>
                    </div>
                    <div className="col-md-6">
                        <br />
                        <b>{hotel.description}</b>
                        <p className="text-primary mt-2"><strong>₹{hotel.price}</strong></p>
                        <p className="card-text">For {diffDays(hotel.from, hotel.to)} {diffDays(hotel.from, hotel.to) > 1 ? "days": "day"}</p>
                        <p  className="card-text">Available from <br />{moment(new Date(hotel.from)).format('MMMM DD YYYY, h:mm:ss a')}</p>
                        <p  className="card-text">To <br />{moment(new Date(hotel.to)).format('MMMM DD YYYY, h:mm:ss a')}</p>
                        <p>Posted By <strong className="text-primary">{hotel.postedBy && hotel.postedBy.name}</strong></p>
                        {!redux_auth ? (<button onClick={() => {history.push('/login')}} className="btn btn-block btn-lg btn-primary">
                            Login to Book
                        </button>):(
                            <button onClick={async() => {
                                setLoading(true);
                                let res = await axios.post(`http://localhost:8001/api/get-session-id`, hotel, {
                                    headers:{
                                        Authorization: `Bearer ${redux_auth.token}`
                                    }
                                })
                                console.log("SessionId ", res.data.sessionId);
                                // console.log(process.env.STRIPE_PUBLISHABLE_KEY);
                                const stripe = await loadStripe("pk_test_51MLkBfSA2R3C3haDTgoKdZvMNNIaWqAjKFXk7RpusJDvZhIiek1fXsFhcbUemwhgLPn7gTd3lwzFUgfZFRXoW9PY00bAyTOdru");
                                
                                stripe.redirectToCheckout({
                                    sessionId: res.data.sessionId
                                }).then((result) => console.log(result));
                            }} className="btn btn-block btn-lg btn-primary" disabled={loading || alreadyBooked}>
                                {loading ? "Loading..." : alreadyBooked ? "Already Booked": "Book Now"}
                            </button>
                        )}

                    </div>
                </div>
            </div>
            
        </>
    )
}

export default ViewHotel;