import React,{useState, useEffect} from 'react';
import styles from './RoomInfo.module.css';
import {Link} from "react-router-dom";
import axios from 'axios';
interface RoomInfoProps {
    selectedTitle: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ selectedTitle }) => {
    const [inpeople, setInPeople] = useState('');
    const [maxpeople, setMaxPeople] = useState('');
    
    useEffect(() => {
        fetchRoomInfo();
    }, []); 

    const fetchRoomInfo = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/lobby/roomInfo`);
            const { room } = response.data;
            setInPeople(room.inpeople);
            setMaxPeople(room.maxpeople);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className={styles.container}>
            <h2>{selectedTitle}</h2>
            <ul>
                <h3>👤 {inpeople}/{maxpeople} </h3>
            </ul>
            <Link to="/Room">
                <button type="submit">방 입장</button>
            </Link>
        </div>
    );
};

export default RoomInfo;