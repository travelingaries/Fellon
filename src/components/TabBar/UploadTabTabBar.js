import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

import './TabBar.css'

class UploadTabTabBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			currentTab: this.props.currentTab
		}
	}
	render() {
		return (
			<footer id="uploadTabTabBar" className="notReady">
				<nav style={{position: "relative"}}>
					<a href="/" style={{textDecoration:"none"}}>
						<div className="submitUpload">
							업로드하기
						</div>
					</a>
				</nav>
			</footer>
		)
	}
}

export default UploadTabTabBar