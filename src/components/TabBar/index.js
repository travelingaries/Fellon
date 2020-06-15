import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

class TabBar extends Component {
	constructor(){
		super()
		this.state = {
			currentTab: 0
		}
	}
	render() {
		return (
			<div>
				<h2>This TabBar is Working {this.state.currentTab}</h2>
				<NavLink to="/fav">Favorite</NavLink>
			</div>
		)
	}
}

export default TabBar