const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
//route  post api/post
// create a post
// private

router.post('/', [ auth, [ check('text', 'Text is requied ').not().isEmpty() ] ], async (req, res) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({ error: error.array() });
	}
	try {
		const user = await User.findById(req.user.id).select('-password');
		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		});

		const post = await newPost.save();
		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});
//route  get api/post
//  get all  post
// private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('sever error');
	}
});
//route  get api/post/:id
//  get post by id
// private
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(400).json({ msg: 'Post not found' });
		}
		res.json(post);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Post not found' });
		}
		res.status(500).json('sever error');
	}
});
//route  DELETE api/post/:id
//  delete post
// private
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(400).json({ msg: 'Post not found' });
		}
		// check user
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User is not authorized' });
		}
		await post.remove();
		res.json({ msg: 'Post removed' });
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Post not found' });
		}
		res.status(500).json('sever error');
	}
});
//route  PUT api/posts/like/:id
//  like a  post
// private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		// check the post already been liked
		if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
			return res.status(400).json({ msg: 'Post already liked' });
		}
		post.likes.unshift({ user: req.user.id });

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});
//route  PUT api/posts/unlike/:id
//  unlike a  post
// private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		// check the post already been liked
		if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
			return res.status(400).json({ msg: 'Post has not been liked' });
		}
		// GET remove index
		const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);
		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});
//route  post api/post/comment/:id
// comment on a post
// private

router.post('/comment/:id', [ auth, [ check('text', 'Text is requied ').not().isEmpty() ] ], async (req, res) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({ error: error.array() });
	}
	try {
		const user = await User.findById(req.user.id).select('-password');
		const post = await Post.findById(req.params.id);

		const newComment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		};
		post.comments.unshift(newComment);
		await post.save();
		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Post not found' });
		}
		res.status(500).json('server error');
	}
});
//route  Delete api/posts/comment/:id/:comment_id
// delete comment on a post
// private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		// pull out comments
		const comment = post.comments.find((comment) => comment.id === req.params.comment_id);
		// make sure comments exits
		if (!comment) {
			return res.status(404).json({ msg: 'comment does not exist' });
		}
		//Check user
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}
		// GET remove index
		const removeIndex = post.likes.map((comment) => comment.user.toString()).indexOf(req.user.id);
		post.comments.splice(removeIndex, 1);

		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).json('server error');
	}
});

module.exports = router;
