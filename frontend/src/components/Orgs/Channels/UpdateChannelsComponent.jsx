import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import "../OrgsComponent.css";
import { Container, Form, Button, Col, Row, Tab, Tabs, ListGroup, ButtonGroup, InputGroup,FormControl } from "react-bootstrap";


class UpdateChannelsComponent extends Component {
	constructor(props) {
		super(props);
		console.log(props.location.state.channel)
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			channel: props.location.state.channel,
			org_id: this.props.match.params.org_id,
			old_channel_title: this.props.match.params.channel_title,
			channel_title: this.props.match.params.channel_title,
			channel_title_old: this.props.match.params.channel_title,
			channel_title_error: "",
			owned_ids: [],
		};
		this.on_submit = this.on_submit.bind(this);
	}

	on_submit = (e) => {
		e.preventDefault();
		console.log(this.state.channel_title);
		var internal_error = false;
		var error = "";
		var str2 = this.state.channel_title;

		// Ensure Length is 3 or Greater
		if (this.state.channel_title.length < 3 || this.state.channel_title === "new") {
			error = "Channel title too short";
			internal_error = true;
		}

		if (!internal_error) {
			// Check if the ID Exists
			for (let i = 0; i < this.state.owned_ids.length; i++) {
				var str1 = this.state.owned_ids[i].channel_title;
				// Compare the String Values
				if (str1.valueOf() === str2.valueOf()) {
					internal_error = true;
				}
			}

			if (internal_error) {
				console.log("System - ID Already Used");
				this.setState({
					channel_title_error: true,
				});
			} else {
				console.log("System - Creating New Channel");
				let channel = {
					channel_title: this.state.channel_title,
					/*
					Should contain Actual Members and Instances
					*/
					members: [],
					instances: [],
				};
				console.log(channel);
				OrgsResources.update_channel(
					this.state.username,
					this.state.org_id,
					this.state.channel_title_old,
					channel
				).then(() => this.props.history.goBack());
			}
		}

		if (error.length > 0) {
			e.currentTarget.querySelector(".form-control").setCustomValidity("invalid");
		}

		this.setState({channel_title_error: error, validated: true});
	};

	handle_typing_channel_title = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			channel_title: event.target.value,
			channel_title_error: false,
		});
	};

	componentDidUpdate() {}

	componentDidMount() {
		// Retrieves All the Current Channel IDs For the Organisation
		OrgsResources.retrieve_all_channel_titles(this.state.username, this.state.org_id).then(
			(response) => {
				for (let i = 0; i < response.data.length; i++) {
					// They Can Claim the Same ID
					if (this.state.channel_title !== response.data[i]) {
						this.state.owned_ids.push({
							channel_title: response.data[i],
						});
						this.setState({
							owned_ids: this.state.owned_ids,
						});
					}
				}
			}
		);
	}

	render() {
		console.log("System - Rendering Page...");
		return (
			<div className="app-window update-org-component">
				
			</div>
		);
	}
}

export default UpdateChannelsComponent;
