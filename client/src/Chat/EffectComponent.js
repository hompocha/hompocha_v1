import React, { useState, useEffect } from "react";
import CherryBlossom from "../keyword/cherryBlossom";
import CloudCanvas from "../keyword/cloud";
import CatCanvas from "../keyword/cat";
import DogCanvas from "../keyword/Dog";
import FoodCanvas from "../keyword/food";

const EffectComponent = ({ user, sessionConnected }) => {
  const [keywordList, setKeywordList] = useState({
    고양이: [],
    강아지: [],
    벚꽃: [],
    그만해: [],
    뭐먹을까: [],
  });

  useEffect(() => {
    const handleEffect = (event) => {
      const data = event.data;

      if (data === "그만해") {
        setKeywordList({
          고양이: [],
          강아지: [],
          벚꽃: [],
          그만해: [...keywordList.그만해, { x: Math.random() * 100, y: Math.random() * 100 }],
          뭐먹을까: [],
        });
        return;
      }

      if (data === "뭐 먹을까" || data === "뭐먹을까") {
        setKeywordList((prevKeywordList) => ({
          ...prevKeywordList,
          뭐먹을까: [
            ...prevKeywordList.뭐먹을까,
            { x: 30 + (Math.random() * 70), y: Math.random() * 100 },
          ],
        }));
      } else {
        setKeywordList((prevKeywordList) => ({
          ...prevKeywordList,
          [data]: [
            ...prevKeywordList[data],
            { x: Math.random() * 100, y: Math.random() * 100 },
          ],
        }));
      }
    };

    if (sessionConnected) {
      const streamManager = user.getStreamManager().stream.session;
      streamManager.on("signal:effect", handleEffect);

      // Cleanup function
      return () => streamManager.off("signal:effect", handleEffect);
    }
  }, [user]);

  return (
    <div>
      <React.Fragment>
        {keywordList.고양이.map((cat, index) => (
          <CatCanvas key={index} x={cat.x} y={cat.y} />
        ))}
        {keywordList.강아지.map((dog, index) => (
          <DogCanvas key={index} x={dog.x} y={dog.y} />
        ))}
        {keywordList.벚꽃.map((blossom, index) => (
          <CherryBlossom key={index} x={blossom.x} y={blossom.y} />
        ))}
        {keywordList.뭐먹을까.map((food, index) => (
          <FoodCanvas key={index} x={food.x} y={food.y} />
        ))}
      </React.Fragment>
    </div>
  );
};

export default EffectComponent;
