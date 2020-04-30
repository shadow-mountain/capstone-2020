import React, {Component} from "react";
import {Col, Row, Container} from "react-bootstrap";
import ChannelListComponent from "./ChannelListComponent";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import ChatComponent from "../Chat/ChatComponent";

class OrgWrapperComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channel_title: "",
			instance_title: "",
			instanceSelected: false
		};

		this.handleInstanceClick = this.handleInstanceClick.bind(this)
	}

	handleInstanceClick(channel_title, instance_title) {
		this.setState({
			instanceSelected: true,
			channel_title: channel_title,
			instance_title: instance_title
		})

		this.forceUpdate();
	}

	render() {
		return (
			<div className="app-window">
				<div className="d-flex">
					<ChannelListComponent {...this.props} callback={this.handleInstanceClick} orgId={this.state.org_id}></ChannelListComponent>
					<ChatComponent {...this.props} org_id={this.state.org_id} channel_title={this.state.channel_title} instance_title={this.state.instance_title}/>
				</div>
			</div>
		);
	}
}
export default OrgWrapperComponent;
