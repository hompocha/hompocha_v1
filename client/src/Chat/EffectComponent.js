import React, { useState, useEffect } from "react";
import CherryBlossom from "../keyword/cherryBlossom";
import CloudCanvas from "../keyword/cloud";
import CatCanvas from "../keyword/cat";
import DogCanvas from "../keyword/Dog";

const EffectComponent = ({ user, sessionConnected }) => {
  const [keywordList, setKeywordList] = useState({
    고양이: [],
    강아지: [],
    구름: [],
    벚꽃: [],
    그만해: [],
  });

  useEffect(() => {
    const handleEffect = (event) => {
      const data = event.data;
      setKeywordList((prevKeywordList) => ({
        ...prevKeywordList,
        [data]: [
          ...prevKeywordList[data],
          { x: Math.random() * 100, y: Math.random() * 100 },
        ],
      }));
    };
    if (sessionConnected) {
      const streamManager = user.getStreamManager().stream.session;
      streamManager.on("signal:effect", handleEffect);

      // Cleanup function
      return () => streamManager.off("signal:effect", handleEffect);
    }
  }, [user]);
  const stopRequested = keywordList.그만해.length > 0;
  return (
    <div>
      {!stopRequested && (
        <React.Fragment>
          {keywordList.고양이.map((cat, index) => (
            <CatCanvas key={index} x={cat.x} y={cat.y} />
          ))}
        </React.Fragment>
      )}
      {!stopRequested && (
        <React.Fragment>
          {keywordList.강아지.map((dog, index) => (
            <DogCanvas key={index} x={dog.x} y={dog.y} />
          ))}
        </React.Fragment>
      )}
      {!stopRequested && (
        <React.Fragment>
          {keywordList.구름.map((cloud, index) => (
            <CloudCanvas key={index} x={cloud.x} y={cloud.y} />
          ))}
        </React.Fragment>
      )}
      {!stopRequested && (
        <React.Fragment>
          {keywordList.벚꽃.map((blossom, index) => (
            <CherryBlossom key={index} x={blossom.x} y={blossom.y} />
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default EffectComponent;
