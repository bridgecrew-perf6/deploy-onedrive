import formidable from 'formidable';
import fs from 'fs';

const axios = require('axios');

const handler = async (req, res) => {
	const { method } = req;
	switch (method) {
		case 'PUT':
			await upload(req, res);
			break;
		default:
			return res.status(405).send(`Method ${method} not allowed`);
	}
};

const upload = async (req, res) => {
	const form = new formidable.IncomingForm();
	try {
		await new Promise((resolve) => {
			form.parse(req, async (err, fields, files) => {
				const result = await uploadToDrive(
					files.file,
					fields.parentId,
					fields.accessToken
				);
				res.status(200).send(result);
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};

const uploadToDrive = async (file, parentId, accessToken) => {
	const content = fs.readFileSync(file.filepath);
	const filename = file.originalFilename;
	const fileType = file.mimetype;
	const url = `https://graph.microsoft.com/v1.0/users/69e5bc0d-ef63-4040-88cf-0ada867b7afa/drive/items/${parentId}:/${filename}:/content`;
	const result = await axios({
		method: 'put',
		url: url,
		data: content,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': fileType,
		},
	});
	return result.data;
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default handler;