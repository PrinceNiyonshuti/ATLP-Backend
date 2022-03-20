/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
let token = "";
let queryId = "";
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
	const user2 = {
		email: "princ@gmail.com",
		password: "testing data1",
	};
	const user3 = {
		email: "prince@gmail.com",
		password: "testing data2",
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
	it("Admin should not be able to be login due to Invalid email ", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/login")
			.send(user2)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([401]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Admin should not be able to be login due to Invalid Password", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/login")
			.send(user3)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([401]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

// Queries
describe("POST API /api/v1/queries", () => {
	before(() => {
		mongoose.connection.dropCollection("queries");
	});
	const query = {
		name: "Prince Dev", 
		email: "prince@gmail.com",
		subject: "testing data",
		content:
			"Vivamus suscipit tortor eget felis porttitor volutpat. Quisque velit nisi, pretium ut lacinia in, ",
	};
	it("Should return success status and data", (done) => {
		chai
			.request(index)
			.post("/api/v1/queries")
			.send(query)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status").to.equal("success");
				return done();
			});
	});
	it("Should return not Not Authorized , please login ", (done) => {
		chai
			.request(index)
			.get("/api/v1/queries")
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([401]);
				expect(res.body).to.have.property("status").to.equal("fail");
				expect(res.body)
					.to.have.property("message")
					.to.equal("Not Authorized , please login");
				return done();
			});
	});
});

describe("GET API /api/v1/queries", () => {
	before(() => {
		mongoose.connection.dropCollection("queries");
	});
	const query = {
		name: "Prince Dev",
		email: "prince@gmail.com",
		subject: "testing data",
		content:
			"Vivamus suscipit tortor eget felis porttitor volutpat. Quisque velit nisi, pretium ut lacinia in, ",
	};
	it("Should return success status and data", (done) => {
		chai
			.request(index)
			.post("/api/v1/queries")
			.send(query)
			.end((err, res) => {
				if (err) return done(err);
				queryId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status").to.equal("success");
				return done();
			});
	});
	it("Should return all queries  ", (done) => {
		chai
			.request(index)
			.get("/api/v1/queries")
			.set("Authorization", `Bearer ${token}`)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status").to.equal("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Query not found  ", (done) => {
		const fakeId = "1229b52ca50601182da72457";
		chai
			.request(index)
			.get("/api/v1/queries/" + fakeId)
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
	it("Should return single query ", (done) => {
		const qId = queryId;
		chai
			.request(index)
			.get("/api/v1/queries/" + qId)
			.set("Authorization", `Bearer ${token}`)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("data");
				return done();
			});
		
	});
});

describe("DELETE API /api/v1/queries/{:id}", () => {
	before(() => {
		mongoose.connection.dropCollection("queries");
	});
	const query = {
		name: "Prince Dev",
		email: "prince@gmail.com",
		subject: "testing data",
		content:
			"Vivamus suscipit tortor eget felis porttitor volutpat. Quisque velit nisi, pretium ut lacinia in, ",
	};
	it("Should return success status and data", (done) => {
		chai
			.request(index)
			.post("/api/v1/queries")
			.send(query)
			.end((err, res) => {
				if (err) return done(err);
				delId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status").to.equal("success");
				return done();
			});
	});
	it("Should return Query not found  ", (done) => {
		const fakeId = "1229b52ca50601182da72457";
		chai
			.request(index)
			.delete("/api/v1/queries/" + fakeId)
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return Query deleted  ", (done) => {
		const artDelId = delId;
		console.log(artDelId);
		chai
			.request(index)
			.delete("/api/v1/queries/" + artDelId)
			.set("Authorization", `Bearer ${token}`)
			.send()
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([200]);
				console.log("dasdas");
				expect(res.body).to.have.property("status");
				expect(res.body).to.have.property("message").to.equal("Query deleted");
				return done();
			});
	});
});
