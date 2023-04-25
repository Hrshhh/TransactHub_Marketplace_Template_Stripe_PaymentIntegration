import React from 'react';
import {useState, useEffect} from 'react';
import queryString from 'query-string';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HotelRepresentation from './HotelRepresentation';

const SearchResult = ({match}) => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        searchHotels();
    }, [window.location.search])

    const searchHotels = async() => {
        const {location, date, bed} = queryString.parse(window.location.search);
        await axios.post(`http://localhost:8001/api/search-hotel`, {location,date,bed}).then((res) => {
            console.log("Searching Hotels>> ",res);
            setHotels(res.data)
        })
    }


  return (
    <>
    <div className='col'>
        <SearchBar />
    </div>
    <div className='container'>
        <div className='row'>
            
            {
            hotels.map((hotel) => (
                // console.log("H>> ", hotels);
                // {JSON.stringify(hotel, null, 4)}
                <HotelRepresentation key={hotel._id} hotel={hotel}/>
            ))
        }
        </div>
    </div>
    </>
  )
}

export default SearchResult