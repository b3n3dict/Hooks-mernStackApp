const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//route  GET api/profile/me
//get current users profile
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', [ 'name', 'avatar' ]);
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});
//route  post api/profile/
// create and update user profile
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required ').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			instagram,
			linkedin,
			twitter
		} = req.body;

		// build profile object

		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map((skill) => skill.trim());
		}

		// build a social object
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (facebook) profileFields.social.facebook = facebook;
		if (twitter) profileFields.social.twitter = twitter;
		if (instagram) profileFields.social.instagram = instagram;
		if (linkedin) profileFields.social.linkedin = linkedin;

		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				// update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{
						$set: profileFields
					},
					{ new: true }
				);
				return res.json(profile);
			}

			//create
			profile = new Profile(profileFields);
			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).json('Server Error');
		}
	}
);

//route  GET api/profile/
//get all profiles
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [ 'name', 'avatar' ]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('Server Error');
	}
});

//route  GET api/profile/user/user_id
//get  profile by user id

router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', [ 'name', 'avatar' ]);

		if (!profile) return res.status(400).json({ msg: 'Profile not found' });

		res.json(profile);
	} catch (err) {
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		console.error(err.message);
		res.status(500).json('Server Error');
	}
});

//route  delete api/profile/
//  deleting profile , user & posts
router.delete('/', auth, async (req, res) => {
	try {
		//remove user post
		await Post.deleteMany({ user: req.user.id });
		//remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// remove user
		await User.findOneAndRemove({ _id: req.user.id });
		res.json({ msg: 'User Deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).json('Server Error');
	}
});
//route  put  api/profile/experience
//  Add profile experience
router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From  is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(500).json({ errors: errors.array() });
		}
		const { title, company, location, from, to, current, description } = req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		};
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).json('server error');
		}
	}
);
//route  delete  api/profile/experience/:exp_id
//  delete experience from profile
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		//get remove index
		const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
		profile.experience.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});
//route  put  api/profile/education
//  Add profile education
router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is required').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('fieldofstudy', 'Field of study is required').not().isEmpty(),
			check('from', 'From  is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(500).json({ errors: errors.array() });
		}
		const { school, degree, fieldofstudy, from, to, current, description } = req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description
		};
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.education.unshift(newEdu);

			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).json('server error');
		}
	}
);
//route  delete  api/profile/education/:exp_id
//  delete education from profile
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		//get remove index
		const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);
		profile.education.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});
//route get api/profiles/github/:username
//  get user respo from github
router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: encodeURI(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`),
			method: 'GET',
			headers: {
				'user-agent': 'node.js'
			}
		};
		request(options, (error, response, body) => {
			if (error) console.error(error);

			if (response.statusCode !== 200) {
				return res.status(400).json({ msg: 'No github profiles founded' });
			}
			res.json(JSON.parse(body));
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});

module.exports = router;
