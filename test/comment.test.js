/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
let token = "";
let articleId = "";
let commentId = "";
let delId = "";

//sign up
describe("POST API /api/v1/auth/signup", () => {
	before(() => {
		mongoose.connection.dropCollection("users");
	});
	const user = {
		username: "Prince Dev",
		email: "prince@gmail.com",
		role: "admin",
		password: "password",
	};
	it("It should successfully create an account and return 201", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.status).to.be.equal(201);
				return done();
			});
	});
	it("Should return 201 when email exists", (done) => {
		const oldMail = user.email;
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user)
			.end((err, res) => {
				if (oldMail) return done(err);
				expect(res.status).to.be.equal(201);
				expect(res).to.have.property("error");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return 201 when username exists", (done) => {
		const oldUSername = user.username;
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user)
			.end((err, res) => {
				if (oldUSername) return done(err);
				expect(res.status).to.be.equal(201);
				expect(res).to.have.property("error");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

// Sign in
describe("POST API /api/v1/auth/login", () => {
	const user = {
		email: "prince@gmail.com",
		password: "password",
	};
	it("it should successfully login and return 200 and get token", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/login")
			.send(user)
			.end((err, res) => {
				if (err) return done(err);
				token = res.body.token;
				expect(res.status).to.be.equal(200);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				expect(res.body).to.have.property("token");
				return done();
			});
	});
});

// Comments
describe("POST API /api/v1/articles/{:id}/comment", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	before(() => {
		mongoose.connection.dropCollection("comments");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	const comment = {
		content: "thanks for this article with the user data",
	};
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				articleId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Article not found", (done) => {
		const fakeId = "1229b52ca50601182da72457";
		chai
			.request(index)
			.post("/api/v1/articles/" + fakeId + "/comment")
			.set("Authorization", `Bearer ${token}`)
			.send(comment)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return Comment Validation Error ", (done) => {
		const fakeContent = "";
		chai
			.request(index)
			.post("/api/v1/articles/" + articleId + "/comment")
			.set("Authorization", `Bearer ${token}`)
			.send(fakeContent)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([400]);
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return success and comment data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles/" + articleId + "/comment")
			.set("Authorization", `Bearer ${token}`)
			.send(comment)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
});

describe("GET API /api/v1/articles/{:id}/comment", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	before(() => {
		mongoose.connection.dropCollection("comments");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	const comment = {
		content: "thanks for this article with the user data",
	};
	it("Should return success and article data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				articleId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return success and comment data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles/" + articleId + "/comment")
			.set("Authorization", `Bearer ${token}`)
			.send(comment)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return All Comments", (done) => {
		chai
			.request(index)
			.get("/api/v1/articles/" + articleId + "/comment")
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([200]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
});

describe("GET API /api/v1/articles/comment", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	before(() => {
		mongoose.connection.dropCollection("comments");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	const comment = {
		content: "thanks for this article with the user data",
	};
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				articleId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return success and comment data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles/" + articleId + "/comment")
			.set("Authorization", `Bearer ${token}`)
			.send(comment)
			.end((err, res) => {
				if (err) return done(err);
				commentId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Comment not found", (done) => {
		const fakeId = "1229b52ca50601182da72457";
		chai
			.request(index)
			.get("/api/v1/articles/comment/" + fakeId)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return Comment found", (done) => {
		chai
			.request(index)
			.get("/api/v1/articles/comment/" + commentId)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

describe("DELETE API /api/v1/articles/comment", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	before(() => {
		mongoose.connection.dropCollection("comments");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	const comment = {
		content: "thanks for this article with the user data",
	};
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				articleId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return success and comment data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles/" + articleId + "/comment")
			.set("Authorization", `Bearer ${token}`)
			.send(comment)
			.end((err, res) => {
				if (err) return done(err);
				commentId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Comment not found", (done) => {
		const fakeId = "1229b52ca50601182da72457";
		chai
			.request(index)
			.delete("/api/v1/articles/comment/" + fakeId)
			.set("Authorization", `Bearer ${token}`)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return Comment deleted", (done) => {
		chai
			.request(index)
			.delete("/api/v1/articles/comment/" + commentId)
			.set("Authorization", `Bearer ${token}`)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});
