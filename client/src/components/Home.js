import './Home.css';
import {useState, useEffect} from "react";
import axios from 'axios';
import HotelRepresentation from './HotelRepresentation';
import SearchBar from './SearchBar';

const Home = () => {
    const [allHotels, setALLHotels] = useState([]);

    useEffect(() => {
        loadAllHotels();
    }, [])

    const loadAllHotels = async () => {
        await axios.get(`http://localhost:8001/api/hotels`).then((response) => {
            console.log(response.data);
            setALLHotels(response.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    return(
        <>
        <div className="card w-75 mx-auto mb-3 bg-purple p-5 text-center">
            <h2>Home Page</h2>
            
        </div>
        <SearchBar />
        <div className='container-fluid'>
            {allHotels.map((hotel) => (
                <HotelRepresentation key={hotel._id} hotel={hotel} />
            ))}
        </div>
        </>
        
        
    )
}

export default Home;