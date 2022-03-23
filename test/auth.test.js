/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
let token = "";
let userId = "";
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
	const user2 = {
		username: "Prince Dev 1",
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
	it("Should return 201 when email exists", (done) => {
		const oldMail = user.email;
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user2)
			.end((err, res) => {
				if (oldMail) return done(err);
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

// get user profile
describe("GET API /api/v1/auth/user-profile", () => {
	it("Should return the profile of authorized user", (done) => {
		chai
			.request(index)
			.get("/api/v1/auth/user-profile")
			.set("Authorization", `Bearer ${token}`)
			.end((err, res) => {
				if (err) return done(err);
				// userId = res.body.data._id;
				expect(res.status).to.be.eql(200);
				return done();
			});
	});
	it("Should return Not Authorized", (done) => {
		let fakeToken = "testing";
		chai
			.request(index)
			.get("/api/v1/auth/user-profile")
			.set("Authorization", `Bearer ${fakeToken}`)
			.end((err, res) => {
				if (err) return done(err);
				expect(res.status).to.be.equal(401);
				return done();
			});
	});
});
