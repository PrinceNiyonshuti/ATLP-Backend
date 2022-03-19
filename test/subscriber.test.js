/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
let token = "";
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

// subscribing
describe("POST API /api/v1/subscribers", () => {
	before(() => {
		mongoose.connection.dropCollection("subscribers");
	});
	const subscriber = {
		email: "andela@gmail.com",
	};
	it("Should return Email validation", (done) => {
		const fakeMail = "testgmail.com";
		chai
			.request(index)
			.post("/api/v1/subscribers")
			.send(fakeMail)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([400]);
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/subscribers")
			.send(subscriber)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Sorry , you are already subscribed to our newsletter", (done) => {
		chai
			.request(index)
			.post("/api/v1/subscribers")
			.send(subscriber)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([400]);
				expect(res.body).to.have.property("error");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});

describe("GET API /api/v1/subscribers", () => {
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.get("/api/v1/subscribers")
			.set("Authorization", `Bearer ${token}`)
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

describe("DELETE API /api/v1/subscribers", () => {
	before(() => {
		mongoose.connection.dropCollection("subscribers");
	});
	const subscriber = {
		email: "andela@gmail.com",
	};
	it("Should return success and subscriber data", (done) => {
		chai
			.request(index)
			.post("/api/v1/subscribers")
			.send(subscriber)
			.end((err, res) => {
				if (err) return done(err);
				delId = res.body.data._id;
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("data");
				return done();
			});
	});
	it("Should return Email validation", (done) => {
		const fakeMail = "testgmail.com";
		chai
			.request(index)
			.delete("/api/v1/subscribers")
			.send(fakeMail)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([400]);
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return Successfully unsubscribed from our newsletter", (done) => {
		chai
			.request(index)
			.delete("/api/v1/subscribers")
			.send(subscriber)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([200]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
	it("Should return No record found for your email", (done) => {
		chai
			.request(index)
			.delete("/api/v1/subscribers")
			.send(subscriber)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("success");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});
