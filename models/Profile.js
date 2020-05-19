const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	company: {
		type: String
	},
	website: {
		type: String
	},
	location: {
		type: String
	},
	status: {
		type: String,
		required: true
	},
	skills: {
		type: { String },
		required: true
	},
	bio: {
		type: String
	},
	githubusername: {
		type: String
	},
	experirence: [
		{
			titile: {
				type: String,
				required: true
			},
			company: {
				type: String,
				required: true
			},
			location: {
				type: String
			},
			from: {
				type: Date,
				required: true
			},
			to: {
				type: Date
			},
			current: {
				type: Boolean,
				default: false
			},
			description: {
				type: String
			}
		}
	],
	education: [
		{
			school: {
				type: String,
				required: true
			},
			degree: {
				type: String,
				required: true
			},
			fieldofstudy: {
				type: String,
				required: true
			},
			from: {
				type: Date,
				required: true
			},
			to: {
				type: Date
			},
			current: {
				type: Boolean,
				default: false
			},
			description: {
				type: String
			}
		}
	],
	social: {
		youtube: {
			type: String
		},
		facebook: {
			type: String
		},
		instagram: {
			type: String
		},
		twitter: {
			type: String
		},
		linkedin: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const Profile = mongoose.model('profile', profileSchema);
module.exports = Profile;
