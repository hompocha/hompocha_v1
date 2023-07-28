
import React, { useState, useEffect } from 'react';
import CherryBlossom from "../keyword/cherryBlossom";
import CloudCanvas from "../keyword/cloud";
import CatCanvas from "../keyword/cat";
import DogCanvas from '../keyword/Dog';

const EffectComponent = ({ user ,sessionConnected}) => {
    const [effectWord, setEffectWord] = useState('');
    const [keywordList, setKeywordList] = useState([]);

    useEffect(() => {

        const handleEffect = (event) => {
            const data = event.data;
            setKeywordList(prevKeywordList => [
                ...prevKeywordList,
                { x: Math.random() * 100, y: Math.random() * 100 },
            ]);
            setEffectWord(data);
        };
        if(sessionConnected){
        const streamManager = user.getStreamManager().stream.session;
        streamManager.on("signal:effect", handleEffect);

        // Cleanup function
        return () => streamManager.off("signal:effect", handleEffect);
        }
    }, [user]);



    return (
        <div>
            {effectWord === '고양이' && (
                <React.Fragment>
                    {keywordList.map((cat, index) => (
                        <CatCanvas key={index} />
                    ))}
                </React.Fragment>
            )}
            {effectWord === '강아지' && (
                <React.Fragment>
                    {keywordList.map((dog, index) => (
                        <DogCanvas key={index} />
                    ))}
                </React.Fragment>
            )}
            {effectWord === '구름' ? <CloudCanvas/> : null}
            {effectWord === '벚꽃' ? <CherryBlossom /> : null}
        </div>
    );
};

export default EffectComponent;
