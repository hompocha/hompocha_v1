import React, {Component} from "react";
import CatCanvas from "./cat";
import CherryBlossom from "./cherryBlossom";
import DogCanvas from "./Dog";
import CloudCanvas from "./cloud";

export default class KeywordCanvas extends Component{

    render(){
        return(
            <div>
                {this.props.keyword === '고양이' && <CatCanvas/>}
                {this.props.keyword === '강아지' && <DogCanvas/>}
                {this.props.keyword === '벚꽃' && <CherryBlossom/>}
                {this.props.keyword === '구름' && <CloudCanvas/>}

            </div>
        )
    }
}
