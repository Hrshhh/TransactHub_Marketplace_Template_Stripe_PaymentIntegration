import React, { useState } from "react";
import {useHistory, Link} from "react-router-dom";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import BuyerPaymentModal from "./BuyerPaymentModal";

const UserHotelBookings = ({hotel, session, orderedBy}) => {
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();
    const currencyFormatter = (input) => {
        return(input.amount).toLocaleString(input.currency, {
            maximumFractionDigits: 2,
            style: "currency",
            currency: input.currency,
        })
    }
    console.log("Book Hotel >>>", hotel);

    const diffDays = (from, to) => {
        const day = 24*60*60*1000;
        const start = new Date(from);
        const end = new Date(to);
        const difference = Math.round(Math.abs((start-end)/day));
        return difference;
    }

    return(
        <div className="mb-3">
            <div className="row">
                <div className="col-md-4">
                    {hotel.image && hotel.image.contentType ? (
                        <img 
                            src={`http://localhost:8001/api/hotel/image/${hotel._id}`} width="270" height="400" alt="Hotel image" className="img img-fluid"
                        />
                    ): (
                        <img 
                            src="https://via.placeholder.com/900x500.png?text=MERN+Booking" alt="default hotel image" className="img img-fluid"
                        />
                    ) }
                </div>
                <div className="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">{hotel.title}{" "}
                        <span>{currencyFormatter({
                            amount: hotel.price,
                            currency: "inr",
                        })}
                        </span>{" "} </h5>
                        <p className="alert alert-info mt-3">{hotel.location}</p>
                        <p className="card-text">{`${hotel.description.substring(0,200)}...`}</p>
                        <p className="card-text">For {diffDays(hotel.from, hotel.to)} {diffDays(hotel.from, hotel.to) > 1? "days": "day"}</p>
                        <p className="card-text">{hotel.bed} bed</p>
                        <p  className="card-text">Available from {new Date(hotel.from).toLocaleDateString()}</p>

                        {showModal && <BuyerPaymentModal showModal={showModal} session={session} orderedBy={orderedBy} setShowModal={ setShowModal }/>}

                        <div className="d-flex justify-content-between h3">
                            <button onClick={() => {setShowModal(!showModal)}} className="btn btn-primary">Show Payment</button>

                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
    
}

export default UserHotelBookings;