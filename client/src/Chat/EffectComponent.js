
import React, { useState, useEffect } from 'react';
import CherryBlossom from "../keyword/cherryBlossom";
import CloudCanvas from "../keyword/cloud";
import CatCanvas from "../keyword/cat";
import DogCanvas from '../keyword/Dog';

const EffectComponent = ({ user }) => {
    const [effectWord, setEffectWord] = useState('');
    const [keywordList, setKeywordList] = useState([]);

    useEffect(() => {
        const handleEffect = (event) => {
            const data = event.data;
            console.log("뭘받는지 보자:", event.data);
            setKeywordList(prevKeywordList => [
                ...prevKeywordList,
                { x: Math.random() * 100, y: Math.random() * 100 },
            ]);
            setEffectWord(data);
        };

        const streamManager = user.getStreamManager().stream.session;
        streamManager.on("signal:effect", handleEffect);

        // Cleanup function
        return () => streamManager.off("signal:effect", handleEffect);
    }, [user]);

    const sendSignal = (string) => {
        if (this.state.session) {
            this.state.session
                .signal({
                    data: string,
                    to: [],
                    type: "effect",
                })
                .then(() => {
                    console.log("Message successfully sent");
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

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
            {effectWord === '구름' ? <CloudCanvas /> : null}
            {effectWord === '벚꽃' ? <CherryBlossom /> : null}
        </div>
    );
};

export default EffectComponent;
