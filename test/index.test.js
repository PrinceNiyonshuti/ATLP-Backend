/** @format */

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import index from "../src/index";
import "dotenv/config";

chai.use(chaiHttp);
describe("App Testing", () => {
	it("Should display welcome message", (done) => {
		chai
			.request(index)
			.get("/")
			.send()
			.end((err, res) => {
				expect(res).to.have.status([200]);
				expect(res.body).to.have.property("success").to.equal(true);
				expect(res.body).to.have.property("message");
				done();
			});
	});

	it("Should display NOT FOUND ERROR 404", (done) => {
		chai
			.request(index)
			.get("/prince")
			.send()
			.end((err, res) => {
				expect(res).to.have.status([404]);
				expect(res.body).to.have.property("error");
				done();
			});
	});
});
