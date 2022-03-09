/** @format */

import cloudinary from "./imageUpload.js";
export const fileUpload = async (req) => {
	let imageUrl = "";
	await cloudinary.v2.uploader.upload(
		req.file.path,
		async function (err, image) {
			if (err) {
				console.log(err);
			}
			imageUrl = image.url;
		}
	);
	return imageUrl;
};
