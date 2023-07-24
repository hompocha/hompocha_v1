import React, {Component} from "react";
import CatCanvas from "./cat";
import CherryBlossom from "./cherryBlossom";


export default class KeywordCanvas extends Component{

    render(){
        return(
            <div>
                {this.props.keyword === '고양이' && <CatCanvas/>}
                {this.props.keyword === '벚꽃' && <CherryBlossom/>}
                    {/*{this.props.keyword === '고양이' ? <CatCanvas/> :null}*/}
                    {/*{this.props.keyword === '벚꽃' ? <CherryBlossom/>:null}*/}

            </div>
        )
    }
}
