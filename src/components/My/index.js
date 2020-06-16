import React, { Component } from "react";
import TabBar from '../TabBar'
import NavBar from '../NavBar'

import './My.css'

class My extends Component {
    constructor(){
    	super()
    	this.state = {
    		currentTab: 1
    	}
    }
    render() {
        return (
            <div className="regular-index">
            	<NavBar currentTab={this.state.currentTab}/>
                <div className="container">
                    <div className="nothingHere">
                        <div>
                            <h4 style={{fontSize:"20px",textAlign:"center"}}>업로드한 영상이 없네요</h4>
                            <p>하단 업로드 버튼을 눌러 펠롱들에게<br/>관심사와 매력을 어필해보세요.</p>
                        </div>
                    </div>
                </div>
                <TabBar currentTab={this.state.currentTab}/>
            </div>
        );
    }
}

export default My;