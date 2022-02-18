const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');

const handler = async (req, res) => {
	const { method } = req;
	switch (method) {
		case 'PUT':
			await convertToPDF(req, res);
			break;
		default:
			return res.status(405).send(`Method ${method} not allowed`);
	}
};

const convertToPDF = async (req, res) => {
	const form = new formidable.IncomingForm();
	try {
		await new Promise((resolve) => {
			form.parse(req, async (err, fields, files) => {
				console.log('[1]files:');
				const result = await docsToPDF(files.file);
				res.status(200).send(result);

			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
};

const docsToPDF = async (file) => {
	console.log('[2]docsToPDF');
	const formData = new FormData();
	formData.append(
		'instructions',
		JSON.stringify({
			parts: [
				{
					file: 'document',
				},
			],
		})
	);
	formData.append('document', fs.createReadStream(file.filepath));
	(async () => {
		try {
			const response = await axios.post(
				'https://api.pspdfkit.com/build',
				formData,
				{
					headers: formData.getHeaders({
						Authorization:
							'Bearer pdf_live_gR4A72nYsyROCKQgR0SyJTPPn2DIr9MYOe0dYQPtj8m',
					}),
					responseType: 'stream',
				}
			);
			// It saves to the local, but I want to save it on OneDrive
			//await response.data.pipe(fs.createWriteStream('./public/result.pdf'));
			console.log('content',response.data);
			await delay(3000);
			console.log("Waited 3s");

			await uploadToDrive(response.data);

			// if (fs.existsSync('public/result.pdf')) {
			// 	fs.unlink('public/result.pdf', function (err) {
			// 		if (err) throw err;
			// 		console.log('File deleted!');
			// 	})
			// } 


			return response.data;

		} catch (e) {
			const errorString = await streamToString(e.response.data);
			console.log(errorString);
			return errorString;
		}
	})();
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const uploadToDrive = async (data) => {
	const parentId = '01XA3PFKG7YWH2K7QVIZCYRP33XLQEHLZG';
	const content = data;
	const filename = 'test.pdf';
	const fileType = 'application/pdf';
	console.log("content", content);
	console.log("filename", filename);
	console.log("filetype0", fileType);
	console.log(process.env.ACCESS_TOKEN);
	const url = `https://graph.microsoft.com/v1.0/users/69e5bc0d-ef63-4040-88cf-0ada867b7afa/drive/items/${parentId}:/${filename}:/content`;
	const result = await axios({
		method: 'put',
		url: url,
		data: content,
		headers: {
			Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
			'Content-Type': fileType,
		},
	});
	console.log(result.data);
	return result.data;

}

function streamToString(stream) {
	const chunks = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on('error', (err) => reject(err));
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	});
}

export const config = {
	api: {
		bodyParser: false,
	},
};

export default handler;
