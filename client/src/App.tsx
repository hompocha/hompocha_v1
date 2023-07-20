// index.jsx
import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Login from './Log/Login';
import Lobby from './Lobby/Lobby';
import Circle from './Lobby/Circle';
import RoomCreate from './Lobby/RoomCreate';
import RoomInfo from './Lobby/RoomInfo';
import UserList from './Lobby/UserList';
import Room from './Room/Room';
import GameCam from "./Games/AirHockey/GameCam";
import SpeechRecognitionExample from './voice/useSpeechRecognition';
import './App.css';

const App = (): JSX.Element => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/SpeechRecognitionExample" element={<SpeechRecognitionExample/>} />
            <Route path="/" element={<Login />} />
            <Route path="/Lobby" element={<Lobby />} />
            <Route path="/Circle" element={<Circle />} />
            <Route path="/RoomCreate" element={<RoomCreate />} />
            <Route path="/RoomInfo" element={<RoomInfo />} />
            <Route path="/UserList" element={<UserList />} />
            <Route path="/Room" element={<Room />} />
            <Route path="/GameCam" element={<GameCam />} />
        </Routes>
        </BrowserRouter>
    );
};

export default App;
export { default as useSpeechRecognition } from './voice/useSpeechRecognitions';
