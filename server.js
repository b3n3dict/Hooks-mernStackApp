const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

const users = require('./routers/api/users');
const profile = require('./routers/api/profile');
const posts = require('./routers/api/posts');
const auth = require('./routers/api/auth');
// Connect Database
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

//define routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

/// Serve Static Assets in production

if (process.env.NODE_ENV === 'production') {
	//Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
});
