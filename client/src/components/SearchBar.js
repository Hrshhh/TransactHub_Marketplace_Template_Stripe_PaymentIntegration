import React, {useState} from 'react'
import {DatePicker, Select} from "antd";
import {SearchOutlined, EnvironmentOutlined } from "@ant-design/icons"
import moment from "moment";
import { useHistory } from 'react-router-dom';
import "./SearchBar.css"; 

const {RangePicker} = DatePicker;
const {Option} = Select;

const SearchBar = () => {
    const [location, setLocation] = useState();
    const [date, setDate] = useState();
    const [bed, setBed] = useState();

    const history = useHistory();

    const handleSubmit = () => {
        history.push(`/search-query?location=${location}&date=${date}&bed=${bed}`);
    }
  return (
    <div className='d-flex pb-4'>
        <div style={{position: 'relative', width:'100%'}}>
            <input 
                placeholder="Search Location..."
                value={location}
                onChange={(e) => {setLocation(e.target.value)}}
                style={{height: '40px', width: '100%'}}
                
            />
            <EnvironmentOutlined style={{position: 'absolute', right: '8px', top:'13px'}}/>
        </div>

        <RangePicker 
            className='w-100'
            onChange = {(value, dateString) => {setDate(dateString)}}
            disabledDate= {(currentDate) => {
                return currentDate && currentDate.valueOf() < moment().subtract(1, "days")
            }}
        />
        

        <Select
            onChange={(bed) => setBed(bed)}
            placeholder="No of beds"
            className='w-100'
            size='large'
        >
            <Option key={1}>1</Option>
            <Option key={2}>2</Option>
            <Option key={3}>3</Option>
            <Option key={4}>4</Option>
        </Select>
        
        <SearchOutlined onClick={handleSubmit} className="btn btn-primary p-2 btn-square"/>
               
    </div>
  )
}

export default SearchBar;