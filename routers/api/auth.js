const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
//route get api/auth
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('server error');
	}
});
//post api/auth  authenticate user & get token
router.post(
	'/',
	[ check('email', 'Please Include an Email').isEmail(), check('password', 'Password is required').exists() ],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
			}

			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
				if (err) {
					throw err;
				}
				res.json({ token });
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);
module.exports = router;
