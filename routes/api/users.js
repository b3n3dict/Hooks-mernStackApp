const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

//route api/users
router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please Include an Email').isEmail(),
		check('password', 'Please enter Password with 6 or more characters').isLength({ min: 6 })
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		res.send('user route');
	}
);

module.exports = router;
