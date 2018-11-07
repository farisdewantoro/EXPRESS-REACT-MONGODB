import React, { Component } from 'react'
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import {createProfile} from '../../actions/profileActions';
 class CreateProfile extends Component {
     constructor(props){
        super(props);
        this.state = {
            displaySocialInputs:false,
            handle:'',
            company:'',
            website:'',
            location:'',
            status:'',
            skills:'',
            githubusername:'',
            bio:'',
            twitter:'',
            facebook:'',
            linkedin:'',
            youtube:'',
            instagram:'',
            errors:{}
        }
     }
     componentWillReceiveProps(nextProps) {
         if (nextProps.errors) {
             this.setState({ errors: nextProps.errors });
         }
     }
     onSubmit = (e) =>{
        e.preventDefault();
        const profileData ={
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
        }

        this.props.createProfile(profileData,this.props.history);
     }

     onChange = (e) =>{
         this.setState({[e.target.name]:e.target.value});
     }

  render() {
      const { errors, displaySocialInputs} = this.state;
        let socialInputs;
      if (displaySocialInputs){
        socialInputs=(
            <div>
                <InputGroup
                    placeholder="twitter profile url"
                    name="twitter"
                    icon="fab fa-twitter"
                    value={this.state.twitter}
                    onChange={this.onChange}
                    error={errors.twitter}
                />
                <InputGroup
                    placeholder="facebook profile url"
                    name="facebook"
                    icon="fab fa-facebook"
                    value={this.state.facebook}
                    onChange={this.onChange}
                    error={errors.facebook}
                />
                <InputGroup
                    placeholder="linked profile url"
                    name="linkedin"
                    icon="fab fa-linkedin"
                    value={this.state.linkedin}
                    onChange={this.onChange}
                    error={errors.linkedin}
                />
                <InputGroup
                    placeholder="youtube profile url"
                    name="youtube"
                    icon="fab fa-youtube"
                    value={this.state.youtube}
                    onChange={this.onChange}
                    error={errors.youtube}
                />
                <InputGroup
                    placeholder="instagram profile url"
                    name="instagram"
                    icon="fab fa-instagram"
                    value={this.state.instagram}
                    onChange={this.onChange}
                    error={errors.instagram}
                />
            </div>
        )
      }
    //   Select Options for status
      const options = [
          {label:'* Select Professional Status',value:0},
          {label:'Developer',value:'Developer'},
          { label: 'Junior Developer', value: 'Junior Developer' },
          { label: 'Senior Developer', value: 'Senior Developer' },
          { label: 'Manager', value: 'Manager' },
          { label: 'Student or Learning', value: 'Student or Learning' },
          { label: 'Intern', value: 'Intern' },
          { label: 'Other', value: 'Other' },

      ];
    return (
      <div className="create-profile">
        <div className="container">
            <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">
                        Create your profile
                    </h1>
                    <p className="lead text-center">
                        Lets get some information to make your profile stand out
                    </p>
                    <small className="d-block pb-3">
                        * = required fields
                    </small>
                    <form onSubmit={this.onSubmit}>
                        <TextFieldGroup
                            placeholder="* Profile Handle"
                            name="handle"
                            value={this.state.handle}
                            onChange={this.onChange}
                            error={errors.handle}
                            info="a unique handle for your profile url. your fullname,company name,nickname "
                        />

                            <SelectListGroup
                                placeholder="Status"
                                name="status"
                                value={this.state.status}
                                onChange={this.onChange}
                                error={errors.status}
                                options={options}
                                info="Give us an idea of where you are at in your career"
                            />
                            <TextFieldGroup
                                placeholder="Company"
                                name="company"
                                value={this.state.company}
                                onChange={this.onChange}
                                error={errors.company}
                                info="Could be your own company or one your work for"
                            />
                            <TextFieldGroup
                                placeholder="website"
                                name="website"
                                value={this.state.website}
                                onChange={this.onChange}
                                error={errors.website}
                                info="Could be your own website or one your work for"
                            />
                            <TextFieldGroup
                                placeholder="location"
                                name="location"
                                value={this.state.location}
                                onChange={this.onChange}
                                error={errors.location}
                                info="City or city & state suggested (eg.Boston)"
                            />
                            <TextFieldGroup
                                placeholder="skills"
                                name="skills"
                                value={this.state.skills}
                                onChange={this.onChange}
                                error={errors.skills}
                                info="Please use comma seprated value"
                            />

                            <TextFieldGroup
                                placeholder="Github Username"
                                name="githubusername"
                                value={this.state.githubusername}
                                onChange={this.onChange}
                                error={errors.githubusername}
                                info="if you want your latest repos and a github link,include your username"
                            />
                            <TextAreaFieldGroup
                                placeholder="Short Bio"
                                name="bio"
                                value={this.state.bio}
                                onChange={this.onChange}
                                error={errors.bio}
                                info="tell us a little about yourself"
                            />

                            <div className="mb-3">
                                <button className="btn btn-light" 
                                type="button" onClick={()=>{
                                    this.setState(prevState =>({
                                        displaySocialInputs:!prevState.displaySocialInputs
                                    }))
                                }}>
                                    Add Social Network Links
                                </button>
                                <span className="text-muted">
                                    Optional
                                </span>
                            </div>
                            {socialInputs}
                            <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
                    </form>
                </div>
            </div>
        </div>
      </div>
    )
  }
}
CreateProfile.propTypes = {
    profile:PropTypes.object.isRequired,
    errors:PropTypes.object.isRequired,


}
const mapStateToProps = state => ({
    profile:state.profile,
    errors:state.errors,
});

export default connect(mapStateToProps,{createProfile})(withRouter(CreateProfile));