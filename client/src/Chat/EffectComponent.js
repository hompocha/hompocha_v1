import React, { Component } from 'react';
import KeywordCanvas from "../keyword/KeywordCanvas";
import CherryBlossom from "../keyword/cherryBlossom";
import CloudCanvas from "../keyword/cloud";
import CatCanvas from "../keyword/cat";

export default class EffectComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            effectWord: '',
            keywordList: [],
        };
        // this.sendEffect = this.sendEffect.bind(this);
    }

    componentDidMount(){
        this.props.user.getStreamManager().stream.session.on("signal:effect",(event)=>{
            const data= event.data;
            console.log("뭘받는지 보자:",event.data);
            this.setState(prevState => ({
                keywordList: [...prevState.keywordList , {x: Math.random() * 100, y: Math.random() * 100}],
                effectWord: data,
            }));
        });
    }

    render() {
        return (
            <div>
                {this.state.effectWord === '고양이' && (
                    <React.Fragment>
                        {this.state.keywordList.map((cat, index) => (
                            <CatCanvas key={index}  />
                        ))}
                    </React.Fragment>
                )}
                {this.state.effectWord === '구름' ? <CloudCanvas/> : null}
                {this.state.effectWord === '벚꽃' ? <CherryBlossom/> : null}

                {/*{this.state.effectWord !== '' && (*/}
                {/*    <React.Fragment>*/}
                {/*        {this.state.keywordList.map((word,index) => (*/}

                {/*            <KeywordCanvas key={index} keyword={this.state.effectWord}/>*/}
                {/*        ))}*/}
                {/*    </React.Fragment>*/}
                {/*)}*/}
            </div>
        );
    }
}

