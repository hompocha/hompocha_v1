import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className='loading'>
      <h3>잠시만 기다려주세요.</h3>
      <img src='/Loading/Loading2.gif' alt="로딩" className='loading-image' />
    </div>
  );
};

export default Loading;
