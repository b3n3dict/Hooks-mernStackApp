const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	text: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	likes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'user'
			}
		}
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'user'
			},
			text: {
				type: String,
				required: true
			},
			name: {
				type: String
			},
			avatar: {
				type: String
			},
			date: {
				type: Date,
				default: Date.now
			}
		}
	],

	date: {
		type: Date,
		default: Date.now
	}
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
