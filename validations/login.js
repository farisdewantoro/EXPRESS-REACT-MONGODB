const Validator = require('validator');
const  isEmpty = require('./is-empty');
module.exports = function validateLoginInput(data){
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';




	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email Field is required';
	}
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password Field is required';
	}

	if (!Validator.isEmail(data.email,{ allow_display_name:true, domain_specific_validation: true })) {
		errors.email = 'Email is invalid ';

	}

	return {
		errors,
		isValid:isEmpty(errors)
	}
}
