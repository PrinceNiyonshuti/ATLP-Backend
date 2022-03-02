/** @format */

import Query from "../db/model/query.model";
import { queryValidation } from "../validation/index";

export const saveQuery = async (req, res) => {
	const { error } = queryValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	const query = req.body;
	const newQuery = new Query(query);
	await newQuery.save();
	res.status(201).json({ success: true, data: newQuery });
};

export const getAllQueries = async (req, res) => {
	const queries = await Query.find();
	res.status(200).json({ success: true, data: queries });
};

export const getById = async (req, res) => {
	const { id } = req.params;
	const query = await Query.findById(id);
	if (!query)
		return res.status(404).json({ success: false, message: "Query not found" });
	res.status(200).json({ success: true, data: query });
};

export const deleteQueryById = async (req, res) => {
	const { id } = req.params;
	const query = await Query.findById(id);
	if (!query)
		return res.status(404).json({ success: false, message: "Query not found" });
	await Query.findByIdAndDelete(id);
	res
		.status(200)
		.json({ success: true, message: "Query deleted", data: query });
};
