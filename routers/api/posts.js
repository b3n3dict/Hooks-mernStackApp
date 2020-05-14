const express = require('express');
const router = express.Router();

//route api/post
router.get('/', (req, res) => {
	res.send('Posts route');
});

module.exports = router;
