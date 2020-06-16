import React, { Component } from "react";
import TabBar from '../TabBar'
import NavBar from '../NavBar'

class Notification extends Component {
    constructor(){
    	super()
    	this.state = {
    		currentTab: 3
    	}
    }
    render() {
        return (
            <div className="regular-index">
                <NavBar currentTab={this.state.currentTab}/>
                <h1>Welcome to Notification</h1>
            	<TabBar currentTab={this.state.currentTab}/>
            </div>
        );
    }
}

export default Notification;
