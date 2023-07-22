// index.jsx
import React from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";

import Login from "./Log/Login";
import Lobby from "./Lobby/Lobby";
import Room from "./Room/Room";
import "./App.css";
import GameCam from "./Games/GameCam";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/Room" element={<Room />} />
        <Route path="/GameCam" element={<GameCam />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
export { default as useSpeechRecognition } from "./voice/useSpeechRecognitions";
