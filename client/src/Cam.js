import CamSlice from "./CamSlice";
import UserVideoComponent from "./UserVideoComponent";
import "./Cam.css";

function Cam({ num, publisher, subscribers }) {
  console.log(`subscribers : ${subscribers}`);

  return (
    <div>
      <div className="main">
        <div className="parent-div">
          <div className="part1">
            <UserVideoComponent
              className="userVideo"
              streamManager={publisher}
            />
          </div>
          <div className="part2">
            {num > 1 ? (
              <UserVideoComponent streamManager={subscribers[0]} />
            ) : null}
          </div>
        </div>
        <div className="parent-div">
          <div className="part3">
            {num > 2 ? (
              <UserVideoComponent streamManager={subscribers[1]} />
            ) : null}
          </div>
          <div className="part4">
            {num > 3 ? (
              <UserVideoComponent streamManager={subscribers[2]} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cam;
