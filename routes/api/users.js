const express = require('express');
const router = express.Router();

//route api/users
router.get('/', (req, res) => {
	res.send('user route');
});

module.exports = router;
