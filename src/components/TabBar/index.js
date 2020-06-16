import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

import UploadTabTabBar from './UploadTabTabBar'
import './TabBar.css'

import MyTabImgOn from '../../images/icoMyOn.png'
import MyTabImgOff from '../../images/icoMyOff.png'
import NotificationTabImgOff from '../../images/icoAlarmOff.png'
import NotificationTabImgOn from '../../images/icoAlarmOn.png'
import AddTabImgOn from '../../images/icoAdd.png'

class TabBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			currentTab: this.props.currentTab
		}
	}
	render() {
		if(this.state.currentTab==1||this.state.currentTab==3){
			return (
			<footer>
				<nav style={{position: "relative"}}>
					<div className="tabBar">
						<a href="/">
							<div className="tab">
								<img src={this.state.currentTab == 1 ? MyTabImgOn : MyTabImgOff}/>
							</div>
						</a>
						<a href="/upload">
							<div className="tab">
								<img src={AddTabImgOn}/>
							</div>
						</a>
						<a href="/notification">
							<div className="tab">
								<img src={this.state.currentTab == 3 ? NotificationTabImgOn : NotificationTabImgOff}/>
							</div>
						</a>
					</div>
				</nav>
			</footer>
		)
		}
		else {
			return (<UploadTabTabBar />)
		}
		
	}
}

export default TabBar