import mongoose from 'mongoose'

mongoose
	.connect("mongodb://localhost:27017/ATLP-db", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("App connected to Mongodb successfully");
	})
	.catch((e) => {
		console.log("Mongodb connection error " + e.message);
	});
