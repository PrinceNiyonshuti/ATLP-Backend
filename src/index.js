/** @format */

import "./db";
import express from "express";
import queryRoutes from "./routes/query.route";
import authRoutes from "./routes/auth.route";
import article from "./routes/article.route";
import comment from "./routes/comment.route";
import "dotenv/config";

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
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/articles", article);
server.use("/api/v1/articles", comment);
//port number
const port = process.env.PORT;
server.listen(port || 3000, () => {
	console.log("Server listening on port " + port);
});
