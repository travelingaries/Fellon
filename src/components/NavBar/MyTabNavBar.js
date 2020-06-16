import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

import './NavBar.css'

class MyTabNavBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			currentTab: this.props.currentTab
		}
	}
	render() {
		return (
			<nav className="navBar" style={{position: "relative"}}>
				<h1>Yassssssss</h1>
			</nav>
		)
	}
}

export default MyTabNavBar