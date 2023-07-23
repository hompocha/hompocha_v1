import React from "react";
import ChatComponent from "./Chat/ChatComponent";
import CamFour from "./cam/CamFour";


export default class ParentComponent extends React.Component {
    state = {
        videoLoaded: false,
        camFourStream: null
    }

    handleVideoLoad = (localUser) => {
        this.setState({ videoLoaded: true , camFourStream: localUser});
    }

    render() {
        return (
            <div>
                <CamFour onVideoLoad={this.handleVideoLoad} />
                {this.state.videoLoaded &&
                    <ChatComponent user={this.state.camFourStream} /> }
            </div>
        );
    }
}
