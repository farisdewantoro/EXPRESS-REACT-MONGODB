const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

// Load user model
const User = require('../../models/User');

// @route 			GET api/users/test
// @description Test users route
// @access 			Public
router.get('/test',(req,res)=>{
	res.json({msg:"Users works"});
});

// @route 			GET api/users/test
// @description Register user
// @access 			Public
router.post('/register',(req,res)=>{
	const {errors,isValid} = validateRegisterInput(req.body);
// Check validations
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({email:req.body.email})
	.then((user)=>{
		if (user) {
			errors.email = 'Email is invalid'
			return res.status(400).json(errors);
		}else {
			const avatar = gravatar.url(req.body.email,{
				s:'200', //size
				r:'pg', // rating
				d:'mm' //default
			})
			const newUser = new User({
				name:req.body.name,
				email:req.body.email,
				avatar:avatar,
				password:req.body.password
			});

			bcrypt.genSalt(10,(err,salt)=>{
			//10 adalah berapa banyak karakter
				bcrypt.hash(newUser.password,salt,(err,hash)=>{
					if (err) {
						throw err;
					}
					newUser.password = hash;
					newUser.save()
						.then((user)=>{
							res.json(user);
						})
						.catch((err)=>{
							console.log(err);
						});
				});
			});
		}
	});
});

// @route 			GET api/users/login
// @description Login user / Returning jwt token
// @access 			Public
router.post('/login',(req,res)=>{
	const {errors,isValid} = validateLoginInput(req.body);
// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;
	// find user by Email
	User.findOne({email})
		.then((user)=>{
			// check for users
			if (!user) {
				errors.email = 'User not found';
				return res.status(400).json(errors);
			}
			// check password
			bcrypt.compare(password,user.password)
				.then(isMatch =>{
					if (isMatch) {
							// User Matched

							const payload = {id:user.id,name:user.name,avatar:user.avatar}; // create jwt payload


							// Sign token
							jwt.sign(
								payload,
								keys.secretOrKey,{
								expiresIn:3600
							},(err,token)=>{
								res.json({
									success:true,
									token:"Bearer " + token
								});
							});
					}else {
						errors.password='Password incorrect'; return res.status(400).json(errors);
					}
				});
		});
});

// @route 			GET api/users/current
// @description Return current user
// @access 			Private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
	res.json({
		id:req.user.id,
		email:req.user.email,
		name:req.user.name,
		avatar:req.user.avatar,
		date:req.user.date
	});
});
module.exports = router;
