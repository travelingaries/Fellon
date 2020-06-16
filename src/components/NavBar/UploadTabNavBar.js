import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

import './NavBar.css'

import backImg from '../../images/icoBack@2x.png'

class UploadTabNavBar extends Component {
	constructor(props){
		super(props)
		this.state = {
			currentTab: this.props.currentTab
		}
	}
	render() {
		return (
			<nav className="navBar" id="uploadTabNavBar" style={{position: "relative",display:"flex"}}>
				<a href="/">
					<div>
						<img style={{width: "28px", marginTop:"6px", marginLeft:"10px"}} src={backImg} />
					</div>
				</a>
				<div style={{textAlign:"center",justifyContent:"center", alignItems:"center", marginRight:"38px",width:"100%"}}>
					<h4 style={{display:"inline-block",marginTop:"10px",textAlign:"center"}}>영상업로드</h4>
				</div>
			</nav>
		)
	}
}

export default UploadTabNavBar