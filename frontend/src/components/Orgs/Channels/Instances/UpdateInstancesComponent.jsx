import React, {Component} from "react";
import OrgsResources from "../../OrgsResources.js";
import AuthenticationService from "../../../Authentication/AuthenticationService.js";
import "../../OrgsComponent.css";
import {Container, Form, Button} from "react-bootstrap";

class UpdateInstancesComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channel_title: this.props.match.params.channel_title,
			instance_title: this.props.match.params.instance_title,
			instance_title_old: this.props.match.params.instance_title,
			instance_title_error: false,
			owned_ids: [],
			validated: false,
		};
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = (e) => {
		e.preventDefault();
		var error = "";

		var internal_error = false;
		var str2 = this.state.instance_title;

		// Ensure Length is 3 or Greater
		if (this.state.instance_title.length < 3 || this.state.instance_title === "new") {
			error = "ID too short";
			internal_error = true;
		}

		if (!internal_error) {
			// Check if the ID Exists
			for (let i = 0; i < this.state.owned_ids.length; i++) {
				var str1 = this.state.owned_ids[i].instance_title;
				// Compare the String Values
				if (str1.valueOf() === str2.valueOf()) {
					internal_error = true;
				}
			}

			if (internal_error) {
				error = "ID Already Used";
			} else {
				let instance = {
					instance_title: this.state.instance_title,
					/*
					Should contain Actual Members and Instances
					*/
					members: [],
					instances: [],
				};
				OrgsResources.update_instance(
					this.state.username,
					this.state.org_id,
					this.state.instance_title_old,
					instance
				).then(() => this.props.history.goBack());
			}
		}
		if (error.length > 0) {
			e.currentTarget.querySelector(".form-control").setCustomValidity("invalid");
		}

		this.setState({instanceTitleError: error, validated: true});
	};

	handle_typing_instance_title = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			instanceTitle: event.target.value,
			instanceTitleError: false,
		});
	};

	componentDidUpdate() {}

	componentDidMount() {
		// Retrieves All the Current Instance IDs For the Organisation
		OrgsResources.retrieve_all_instance_titles(
			this.state.username,
			this.state.org_id,
			this.state.channel_title
		).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				// They Can Claim the Same ID
				if (this.state.instance_title !== response.data[i]) {
					this.state.owned_ids.push({
						instance_title: response.data[i],
					});
					this.setState({
						ownedIds: this.state.owned_ids,
					});
				}
			}
		});
	}

	render() {
		return (
			<div className="app-window FormInstanceComponent">
				<Container>
					<h1>Register a Instance</h1>

					<Form
						noValidate
						validated={this.state.validated}
						onSubmit={this.onSubmit.bind(this)}>
						<Form.Group>
							<Form.Label>Instance Title</Form.Label>
							<Form.Control
								required
								type="text"
								name="instance_title"
								id="instance_title"
								value={this.state.instance_title}
								onChange={this.handle_typing_instance_title}
								placeholder="Instance Title"
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.instance_title_error}
							</Form.Control.Feedback>
						</Form.Group>
						<Button id="instance_create" type="submit">
							Create Instance
						</Button>
					</Form>
				</Container>
			</div>
		);
	}
}

export default UpdateInstancesComponent;
