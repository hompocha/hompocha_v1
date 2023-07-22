import React,{useState, useEffect} from 'react';
import styles from './RoomInfo.module.css';
import {Link} from "react-router-dom";
import axios from 'axios';
const RoomInfo: React.FC = () => {
    // const rooms = ['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5'];
    // const [sc, setSc] = useState<string>("");
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [game, setGame] = useState('');
    const [mode, setMode] = useState('');
    const [inpeople, setInPeople] = useState('');
    const [tag, setTag] = useState('');
    const [master, setMaster] = useState('');
    const [maxpeople, setMaxPeople] = useState('');
    
    useEffect(() => {
        fetchRoomInfo();
    }, []); 

    const fetchRoomInfo = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/roomInfo`);
            const { room } = response.data;
            setId(room.id);
            setTitle(room.title);
            setInPeople(room.inpeople);
            setTag(room.tag);
            setMaxPeople(room.maxpeople);
            setGame(room.game);
            setMode(room.mode);
            setMaster(room.master);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className={styles.position}>
            <div className={styles.container}>
                <h2 className={styles.title}>{title}</h2>
                <ul>
                    {/* {rooms.map((room, idx) => (
                        <li key={idx} className={styles.room}>{room}</li>
                    ))} */}
                    <h3>👤 {inpeople}/{maxpeople} </h3>
                    <h4>#{tag}</h4>
                </ul>
                <div className={styles.roomIn}>
                    <Link to="/Room">
                        <button type="submit">방 입장</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoomInfo;
