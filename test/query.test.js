/** @format */
import index from "../src/index";
import "dotenv/config";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import mongoose from "mongoose";

chai.use(chaiHttp);
describe("Testing Query Endpoints", () => {
	before(() => {
		mongoose.connection.dropCollection("queries");
	});
	const query = {
		name: "Prince Dev",
		email: "prince@gmail.com",
		subject: "testing data",
		content:"Vivamus suscipit tortor eget felis porttitor volutpat. Quisque velit nisi, pretium ut lacinia in, ",
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
});
