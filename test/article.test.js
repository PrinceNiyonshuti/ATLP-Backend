/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
let token = "";
let articleId = "";
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

// articles
describe("POST API /api/v1/articles", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	it("Should return Article validation", (done) => {
		const fakeArticle = {
			title: "",
			slug: "",
			author: "",
			content: "",
		};
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(fakeArticle)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([400]);
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return success and Article data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Slug is already in use", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([400]);
				expect(res.body).to.have.property("error");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

describe("GET API /api/v1/articles", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return all articles", (done) => {
		chai
			.request(index)
			.get("/api/v1/articles")
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([200]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
});

describe("GET API /api/v1/articles/{:id}", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
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
	it("Should return all single article", (done) => {
		chai
			.request(index)
			.get("/api/v1/articles/" + articleId)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([200]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});

	it("Should return Article not found", (done) => {
		const fakeId = "1229b52ca50601182da72457";
		chai
			.request(index)
			.get("/api/v1/articles/" + fakeId)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

describe("PUT API /api/v1/articles/{:id}", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	const updateArticle = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
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
			.put("/api/v1/articles/" + fakeId)
			.set("Authorization", `Bearer ${token}`)
			.send(updateArticle)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return Article updated successfully", (done) => {
		chai
			.request(index)
			.put("/api/v1/articles/" + articleId)
			.set("Authorization", `Bearer ${token}`)
			.send(updateArticle)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([200]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

describe("DELETE API /api/v1/articles/{:id}", () => {
	before(() => {
		mongoose.connection.dropCollection("articles");
	});
	const article = {
		title: "testing article",
		slug: "testing-article",
		author: "Prince Dev",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
	};
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/articles")
			.set("Authorization", `Bearer ${token}`)
			.send(article)
			.end((err, res) => {
				if (err) return done(err);
				delId = res.body.data._id;
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
			.delete("/api/v1/articles/" + fakeId)
			.set("Authorization", `Bearer ${token}`)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});
