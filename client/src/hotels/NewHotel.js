import {useState} from 'react';
import {toast} from 'react-toastify';
import { DatePicker, Select } from 'antd';
import moment from "moment";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


const NewHotel = () => {
    const {redux_auth} = useSelector((state) => ({...state}));
    const {token} = redux_auth;
    const {Option} = Select;
    const [values, setValues] = useState({
        title: '',
        description: '',
        location: '',
        image: '',
        price: '',
        to: '',
        from: '',
        bed: '',
    })
    const [preview, setPreview] = useState("https://via.placeholder.com/100x100.png?text=PREVIEW");

    const {title, description, location, image, price, to, from, bed} = values;
    let history = useHistory();
    
    const handleImageChange = (e) => {
        setPreview(URL.createObjectURL(e.target.files[0]));
        setValues({...values, image: e.target.files[0]});
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        console.log(values);
        const formdata = new FormData();
        formdata.append("title", title);
        formdata.append("description", description);
        formdata.append("location", location);
        formdata.append("title", title);
        formdata.append("price", price);
        image && formdata.append("image", image);
        formdata.append("to", to);
        formdata.append("from", from);
        formdata.append("bed", bed);

        // console.log("Values ", formdata);
        try{
            await axios.post(`http://localhost:8001/api/create-hotel`, formdata, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                } 
            ).then((response) => {
                console.log("Hotel Data ", response.data);
                toast.success("New Hotel is Posted");
                // history.push("/");
                setTimeout(() => {
                    window.location.reload();
                }, 2000)
                
            })
        }
        catch(err) {
            console.log("Hotel data error ", err);
            toast.error(err.response.data);
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setValues({...values, [name]: value});
    }


    const hotelForm = () => (
        <form onSubmit={handleSubmit}>
            <div>
                <label className='btn btn-outline-warning  m-2'>
                    Image
                    <input 
                        type='file' 
                        name="image" 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        hidden
                    />
                </label>
                
                <input 
                    type="text"
                    name="title"
                    onChange={handleChange}
                    placeholder="Title"
                    className='form-control m-2'
                    value={title}
                />

                <textarea 
                    name="description"
                    onChange={handleChange}
                    placeholder="Description"
                    className='form-control m-2'
                    value={description}
                />

                {/* <ReactGoogleAutocomplete
                    className="form-control m-2"
                    apiKey={process.env.GOOGLE_PLACES_API_KEY}
                    placeholder='Enter location'
                    onSelect={(place) => {
                        console.log("PLACE ",place.formatted_address);
                        // setLocation(place.formatted_address);
                    }}
                    style={{ height: "50px" }}
                /> */}

                {/* <Autocomplete
                    className="form-control m-2"
                    placeholder="Location"
                    apiKey="AIzaSyCooL7atVqjDLRBNXAHeEfY0FCmRNxX6SQ"
                    onPlaceSelected={(place) => {
                        console.log("PLACE ",place);
                        // setLocation(place.formatted_address);
                    }}
                    style={{ height: "50px" }}
                /> */}
                <input 
                    type="text"
                    name="location"
                    value={location}
                    className="form-control m-2"
                    placeholder="Enter Location"
                    onChange = {handleChange}
                />

                <input 
                    type="number"
                    name="price"
                    onChange={handleChange}
                    placeholder="Price"
                    className='form-control m-2'
                    value={price}
                />

                {/* <input 
                    type="number"
                    name="bed"
                    onChange={handleChange}
                    placeholder="Number of beds"
                    className='form-control m-2'
                    value={bed}
                /> */}

                <Select onChange={(value) => setValues({...values, bed: value})} className="w-100 m-2" size='large' placeholder="Number of beds">
                    <Option key={1}>1</Option>
                    <Option key={2}>2</Option>
                    <Option key={3}>3</Option>
                    <Option key={4}>4</Option>
                </Select>

                <DatePicker 
                    placeholder='To Date'
                    className='form-control m-2'
                    onChange={(date, dateString) => {
                        console.log(dateString);
                        setValues({...values, to: dateString});
                    }}
                    disabledDate={(current) => current && current.valueOf() < moment().subtract(1, "days")}
                />

                <DatePicker 
                    placeholder='From Date'
                    className='form-control m-2'
                    onChange={(date, dateString) => {
                        console.log(dateString);
                        setValues({...values, from: dateString});
                    }}
                    disabledDate= {(current) => current && current.valueOf() < moment().subtract(1, "days")}
                />

                <button className='btn btn-outline-warning m-2' onChange={handleSubmit}>Save</button>
            </div>

            
        </form>
    )

    return(
        <>
            <div className="card w-75 mx-auto mb-3 bg-purple p-5 text-center">
                <h2>Post New Hotel</h2>
                
            </div>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-10'>
                        {hotelForm()}
                    </div>
                    <div className='col-2'>
                        <img src={preview} alt="preview_image" className='img img-fluid m-2'/>
                        <pre>{JSON.stringify(values,null,1)}</pre>
                    </div>
                </div>
            </div>
            
        </>
        
        
    )
}

export default NewHotel;