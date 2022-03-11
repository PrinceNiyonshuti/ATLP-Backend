/** @format */

import mongoose from "mongoose";
import "dotenv/config";

const environment = process.env.NODE_ENV;
// database url according to environment
// const dev_db_url = process.env.DB_CONNECTION;
// const prod_db_url = process.env.DB_CONNECTION;
// const test_db_url = process.env.TESTING_DB_CONNECTION;

// const connectionUrl =
// 	environment == "dev"
// 		? dev_db_url
// 		: environment == "prod"
// 		? prod_db_url
// 		: test_db_url;
mongoose
	.connect(process.env.DB_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("App connected to Mongodb successfully");
	})
	.catch((e) => {
		console.log("Mongodb connection error " + e.message);
	});
