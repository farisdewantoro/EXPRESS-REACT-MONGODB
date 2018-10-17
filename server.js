const express = require('express');
const mongoose = require('mongoose');

// ROUTER
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
// DB Config
const app = express();
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
	.connect(db,{ useNewUrlParser: true })
		.then(()=>{
			console.log('MongoDB Connected');
		})
		.catch((err)=>{
			console.log(err);
		});


app.get('/',(req,res)=>{
	res.send('hellow! ahay');
});

// User routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
	console.log(`Server running on port ${port}`);
});
