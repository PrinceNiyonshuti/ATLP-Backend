/** @format */

import Query from "../db/model/query.model";
import { decodeToken } from "../middleware/jwt";
import { queryValidation } from "../validation/index";

export const saveQuery = async (req, res) => {
	const { error } = queryValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	const query = req.body;
	const newQuery = new Query(query);
	await newQuery.save();
	res.status(201).json({ status: "success", data: newQuery });
};

export const getAllQueries = async (req, res) => {
	const queries = await Query.find();
	res.status(201).json({ status: "success", data: queries });
};

export const getById = async (req, res) => {
	const { id } = req.params;
	const query = await Query.findById(id);
	if (!query)
		return res.status(204).json({ status: false, message: "Query not found" });
	res.status(201).json({ status: "success", data: query });
};

export const deleteQueryById = async (req, res) => {
	const { id } = req.params;
	const query = await Query.findById(id);
	if (!query)
		return res.status(204).json({ status: false, message: "Query not found" });
	await Query.findByIdAndDelete(id);
	res
		.status(201)
		.json({ status: "success", message: "Query deleted", data: query });
};
