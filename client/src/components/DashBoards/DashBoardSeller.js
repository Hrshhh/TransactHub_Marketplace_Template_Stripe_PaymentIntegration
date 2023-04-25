import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import ConnectNav from "../ConnectNav";
import DashBoardNav from "./DashBoardNav";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import HotelRepresentation from "../HotelRepresentation";

const DashBoardSeller = () => {
    const [ loading, setLoading ] = useState(false);
    const { redux_auth } = useSelector((state) => ({...state}));
    const [hotels, setHotels] = useState([]);
    const {token} = redux_auth;

    useEffect(() => {
        loadSellerHotels();
    }, []);

    const loadSellerHotels = async() => {
        await axios.get(`http://localhost:8001/api/seller-hotels`,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            setHotels(response.data);
        })
    }

    const handleHotelDelete = async(hotelId) => {
        if(!window.confirm("Are you sure?")) return;
        await axios.delete(`http://localhost:8001/api/delete-hotel/${hotelId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log(response);
            toast.success("Hotel Deleted");
            loadSellerHotels();
        })
    }

    const Connected = () => {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-10">
                        <h3>Your Hotels</h3>
                    </div>
                    <div className="col-md-2">
                        <Link to="/hotels/new" className="btn btn-primary">+ Add New</Link>
                    </div>
                </div>
                <div className="row">
                    {hotels.map(hotel => 
                        <HotelRepresentation 
                            key={hotel._id} 
                            hotel={hotel} 
                            owner={true} 
                            showViewMoreButton={false} 
                            handleHotelDelete= {handleHotelDelete}
                        />)
                    }
                </div>
            </div>
        )
    }

    const handleClick = async () => {
        setLoading(true);
        try{
            console.log("Under Handle Click");
            await axios.post(`http://localhost:8001/api/create-connect-account`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then((res) => {
                console.log("Handle Click executed ", res);
                window.location.href = res.data;
            })
            console.log("Handle Click executed");
        }
        catch(err){
            console.log(err);
            toast.error("Stripe connect failed.Try again");
            setLoading(false);
        }
    }


    const notConnected = () => {
        return(
            <div className="container-fluid text-center">
                <div className="p-3">
                    <p className="lead">
                        Company_Name partners with stripe to transfer earnings to your bank account
                    </p>
                    <button disabled={loading} onClick={handleClick} className="btn btn-purple text-white mb-2">
                        {loading ? "Processing..": "Setup Payouts"}
                    </button>
                    
                </div>
            </div>
        )
        
    }


    return (
        <>
        <div className="card w-75 mx-auto p-5 bg-warning text-center">
            <ConnectNav />
        </div>

        <div className="container-fluid p-4">
            <DashBoardNav />
        </div>

        {redux_auth && 
        redux_auth.user && 
        redux_auth.user.stripe_seller && 
        redux_auth.user.stripe_seller.charges_enabled 
        ? Connected() 
        : notConnected()
        }

        </>
    )
}

export default DashBoardSeller;