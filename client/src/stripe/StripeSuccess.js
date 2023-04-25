import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingOutlined from "@ant-design/icons";
import axios from "axios";

const StripeSuccess = ({match}) => {
    const {redux_auth: {token}} = useSelector((state) => ({...state}));
    const history = useHistory();

    useEffect(() => {
        stripeSuccess();
    },[match.params.hotelId])

    const stripeSuccess = async() => {
        let path = match.params.hotelId;
        console.log("Token ", token);
        await axios.post(`http://localhost:8001/api/stripe-success`, 
        { path }, 
        {headers: {
            Authorization: `Bearer ${token}`
        }})
        .then((response) => {
            if(response.data.success){
                history.push("/dashboard");
            }
            else{
                history.push("/stripe/cancel");
            }
        })
    }

    return(
        <div className="container">
            <div className="d-flex justify-content-center p-5">
                <LoadingOutlined className="display-1 text-warning p-5" />
            </div>
        </div>
    )
}

export default StripeSuccess;