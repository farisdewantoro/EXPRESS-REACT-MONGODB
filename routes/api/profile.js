const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validations
const validateProfileInput =require('../../validations/profile');
const validateExperienceInput =require('../../validations/experience');
const validateEducationInput =require('../../validations/education');

// Load profile model
const Profile = require('../../models/Profile');

// load user profile model
const User = require('../../models/User');


// @route 			GET api/profile
// @description Get current users profile
// @access 			Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
	const errors = {};

	Profile.findOne({user:req.user.id})
	.populate('user',['name','avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'there is no profile for this user ';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => {
		return	res.status(404).json(err);
		})
});

// @route 			GET api/profile/all
// @description Get all profile
// @access 			Public
router.get('/all', (req,res) => {
	const errors = {};
	Profile.find()
		.populate('user',['name','avatar'])
		.then(profiles => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles';
					return res.status(404).json(errors);
			}
			res.json(profiles);
		})
		.catch(err =>res.status(404).json({
			profile:'There is no profiles '
		}));
});

// @route 			GET api/profile/handle/:handle
// @description Get profile by handle
// @access 			Public
router.get('/handle/:handle', (req,res) => {
	const errors = {};
	Profile.findOne({handle:req.params.handle})
		.populate('user',['name','avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
			 return	res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err =>res.status(404).json(err));
});



// @route 			GET api/profile/user/:user_id
// @description Get profile by user id
// @access 			Public
router.get('/user/:user_id', (req,res) => {
	const errors = {};
	Profile.findOne({user:req.params.user_id})
		.populate('user',['name','avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
			return	res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err =>res.status(404).json({
			profile:'There is no profile  for this user'
		}));
});

// @route 			POST api/profile
// @description Create/edit user profile
// @access 			Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
	const {errors,isValid} = validateProfileInput(req.body);
	// Check validation
	if (!isValid) {
		// Return any errors with 400 Status
		return res.status(400).json(errors);
	}

	const profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.handle)profileFields.handle = req.body.handle;
	if (req.body.company)profileFields.company = req.body.company;
	if (req.body.website)profileFields.website = req.body.website;
	if (req.body.location) profileFields.location = req.body.location;
	if (req.body.bio)profileFields.bio = req.body.bio;
	if (req.body.status)profileFields.status = req.body.status;
	if (req.body.githubusername)profileFields.githubusername = req.body.githubusername;

	// Skills -split into array
if (typeof req.body.skills !== 'undefined') {
	profileFields.skills = req.body.skills.split(',');
}

// Social
profileFields.social = {};
	if (req.body.youtube)profileFields.social.youtube = req.body.youtube;
	if (req.body.twitter)profileFields.social.twitter = req.body.twitter;
	if (req.body.facebook)profileFields.social.facebook = req.body.facebook;
	if (req.body.linkedin)profileFields.social.linkedin = req.body.linkedin;
	if (req.body.instagram)profileFields.social.instagram = req.body.instagram;

	Profile.findOne({user:req.user.id})
		.then(profile =>{
			if (profile) {
					// Update
					Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
					.then(profile => res.json(profile));
			}else {
				// create

				// check if handle exists
				Profile.findOne({handle:profileFields.handle}).then(profile =>{
					if (profile) {
						errors.handle = 'That handle already exists';
					return	res.status(400).json(errors);
					}

					// Save Profile
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
		});
});


// @route 			GET api/profile/experience
// @description Add experience to profile
// @access 			Private
router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res) => {

	const {errors,isValid} = validateExperienceInput(req.body);
	// Check validation
	if (!isValid) {
		// Return any errors with 400 Status
		return res.status(400).json(errors);
	}

	Profile.findOne({user:req.user.id})
		.then(profile => {

			const newExp = {
				title:req.body.title,
				company:req.body.company,
				location:req.body.location,
				from:req.body.from,
				to:req.body.to,
				current:req.body.current,
				description:req.body.description
			}

			// add to exp array
			profile.experience.unshift(newExp);

			profile.save().then(profile => res.json(profile));
		});
})


// @route 			GET api/profile/education
// @description Add education to profile
// @access 			Private
router.post('/education',passport.authenticate('jwt',{session:false}),(req,res) => {

	const {errors,isValid} = validateEducationInput(req.body);
	// Check validation
	if (!isValid) {
		// Return any errors with 400 Status
		return res.status(400).json(errors);
	}

	Profile.findOne({user:req.user.id})
		.then(profile => {

			const newEdu = {
				school:req.body.school,
				degree:req.body.degree,
				fieldofstudy:req.body.fieldofstudy,
				from:req.body.from,
				to:req.body.to,
				current:req.body.current,
				description:req.body.description
			}

			// add to exp array
			profile.education.unshift(newEdu);

			profile.save().then(profile => res.json(profile));
		});
})



// @route 			Delete api/profile/experience/:exp_id
// @description Delete experience from profile
// @access 			Private
router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req,res) => {

	Profile.findOne({user:req.user.id})
		.then(profile => {
			// Get remove index
			const removeIndex = profile.experience
				.map(item => item.id)
				.indexOf(req.params.exp_id);

			// Splice
			profile.experience.splice(removeIndex,1);

			// save
			profile.save().then(profile => res.json(profile));
		})
		.catch(err => res.status(404).json(err));
});

// @route 			Delete api/profile/education/:edu_id
// @description Delete education from profile
// @access 			Private
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res) => {

	Profile.findOne({user:req.user.id})
		.then(profile => {
			// Get remove index
			const removeIndex = profile.education
				.map(item => item.id)
				.indexOf(req.params.edu_id);

			// Splice
			profile.education.splice(removeIndex,1);

			// save
			profile.save().then(profile => res.json(profile));
		})
		.catch(err => res.status(404).json(err));
})

// @route 			Delete api/profile
// @description Delete user from profile
// @access 			Private
router.delete('/',passport.authenticate('jwt',{session:false}),(req,res) => {
	Profile.findOneAndRemove({user:req.user.id})
		.then(() =>{
				User.findOneAndRemove({_id:req.user.id})
					.then(() => res.json({success:true}));
		});
});



module.exports = router;
