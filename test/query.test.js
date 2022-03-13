/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
let token = "";
describe("Testing Admin Authentication Endpoints [Register User]", () => {
	before(() => {
		mongoose.connection.dropCollection("users");
	});
	const user = {
		username: "Prince Dev",
		email: "prince@gmail.com",
		role: "admin",
		password: "testing data",
	};
	it("Admin should be able to be registered", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res.body).to.have.property("status").to.equal("success");
				expect(res.body).to.have.property("message").to.equal("User created");
				return done();
			});
	});
});
describe("Testing Admin Authentication Endpoints [Username Validation Fail]", () => {
	const user = {
		username: "Prince Dev",
		email: "prince@gmail.com",
		role: "admin",
		password: "testing data",
	};
	it("Admin should not be able to be registered because the username is already taken", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res).to.have.property("error");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});
describe("Testing Admin Authentication Endpoints [Email Validation Fail]", () => {
	const user = {
		username: "Prince Dev Data",
		email: "prince@gmail.com",
		role: "admin",
		password: "testing data",
	};
	it("Admin should not be able to be registered because the Email is already taken", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/signup")
			.send(user)
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status([201]);
				expect(res).to.have.property("error");
				expect(res.body).to.have.property("message");
				return done();
			});
	});
});
describe("Testing Admin Authentication Endpoints [Login User]", () => {
	const user = {
		email: "prince@gmail.com",
		password: "testing data",
	};
	const user2 = {
		email: "princ@gmail.com",
		password: "testing data1",
	};
	const user3 = {
		email: "prince@gmail.com",
		password: "testing data2",
	};
	it("Admin should be able to be login and get token", (done) => {
		chai
			.request(index)
			.post("/api/v1/auth/login")
			.send(user)
			.end((err, res) => {
				if (err) return done(err);
				token = res.body.token;
				expect(res).to.have.status([200]);
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
describe("Testing Query Endpoints", () => {
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
	it("Create a query and return success status and data", (done) => {
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
	it("get all queries [Un Authorized] and should return not Not Authorized , please login ", (done) => {
		chai
			.request(index)
			.get("/api/v1/queries")
			.send(query)
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
	it("While logged in Admin Should retrieve all queries  ", (done) => {
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
});
