/** @format */

import mongoose from "mongoose";

const SubscriberSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);
export default Subscriber;
