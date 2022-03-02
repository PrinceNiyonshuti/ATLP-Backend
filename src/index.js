/** @format */

import "./db";
import express from "express";
import queryRoutes from "./routes/query.route";

const server = express();

// default route
server.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "You successfully landed on ATLP-7 App API for Prince Backend",
	});
});

server.use(express.json());

// route and version
server.use("/api/v1/queries", queryRoutes);

//port number
const port = 5000;
server.listen(port, () => {
	console.log("Server listening on port " + port);
});
