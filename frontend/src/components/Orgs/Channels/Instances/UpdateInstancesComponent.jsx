import React, {Component} from 'react'
import OrgsResources from '../../OrgsResources.js'
import AuthenticationService from '../../../Authentication/AuthenticationService.js'
import '../../OrgsComponent.css'

class UpdateInstancesComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channel_title: this.props.match.params.channel_title,
			instance_title: this.props.match.params.instance_title,
			instance_title_old: this.props.match.params.instance_title, 
			instance_title_error: false,
			owned_ids: []			
		};
		this.on_submit = this.on_submit.bind(this)
	}
	
	on_submit  = () => {
		console.log(this.state.instance_title);
		var internal_error = false;
		var str2 = new String(this.state.instance_title);
		
		// Ensure Length is 3 or Greater
		if(this.state.instance_title.length < 3 || this.state.instance_title === "new") { 
			this.setState({
				org_id_error: true
			})
			internal_error = true;
		}
		
		if(!internal_error) {
			// Check if the ID Exists
			for(let i=0; i<this.state.owned_ids.length; i++){
				var str1 = new String(this.state.owned_ids[i].instance_title);
				// Compare the String Values
				if(str1.valueOf() == str2.valueOf()){
					internal_error = true;
				}
			}
			
			if(internal_error){
				console.log("System - ID Already Used");
				this.setState({
					instance_title_error: true
				})
			} else {
				console.log("System - Creating New Instance");
				let instance = {
					instance_title: this.state.instance_title,
					/*
					Should contain Actual Members and Instances
					*/
					members: [],
					instances: []
				}
				console.log(instance);
				OrgsResources.update_instance(this.state.username, this.state.org_id, this.state.instance_title_old, instance).then(() => this.props.history.goBack());
			}
		}
	} 
	
    handle_typing_instance_title = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
            instance_title: event.target.value,
			instance_title_error: false
        });
	}
	
	componentDidUpdate() {
	}

	componentDidMount() {
		// Retrieves All the Current Instance IDs For the Organisation
 		OrgsResources.retrieve_all_instance_titles(this.state.username, this.state.org_id, this.state.channel_title)
		.then(response => 
		{
			for(let i=0; i<response.data.length; i++){
				// They Can Claim the Same ID
				if(this.state.instance_title != response.data[i]){
					this.state.owned_ids.push({
					instance_title: response.data[i],
					})
					this.setState({
						owned_ids: this.state.owned_ids
					})
				}
			}
		});
	}
	
	render() {
		console.log("System - Rendering Page...");
        return (
            <div className="FormInstanceComponent">
				<h1>Register a Instance</h1>
				<h2>Instance Title</h2>
				<input 
					type="text"
					name="instance_title"
					id="instance_title"
					value={this.state.instance_title}
					onChange={this.handle_typing_instance_title}
					placeholder="Instance Title"
				/>
				<input
					id="instance_update"
					type="button"
					value="Update Instance"
					onClick={this.on_submit}
				/>
			</div>
        )
    }
}

export default UpdateInstancesComponent
