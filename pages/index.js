import react, { useState } from 'react';
import axios from 'axios';
export default function Home() {
	const [file, setFile] = useState('');

	// IT WORKS GREAT, DONT TOUCH
	const handleUpload = async (e) => {
		e.preventDefault();
		console.log(process.env.ACCESS_TOKEN);
		// UPLOAD A FILE TO ONE DRIVE
		const body = new FormData();
		body.append('file', file);
		body.append('accessToken', `${process.env.ACCESS_TOKEN}`); // ASK ME!
		body.append('parentId', '01XA3PFKG7YWH2K7QVIZCYRP33XLQEHLZG');
		console.log('body', body);
		const res = await axios.put(`/api/file`, body);
		console.log(res.data);
	};

	// EDIT THIS
	const handleConvert = async (e) => {
		const body = new FormData();
		body.append('file', file);
		const res = await axios.put(`/api/convert`, body);
		console.log(res.data);
	};

	return (
		<div>
			<input type="file" onChange={(e) => setFile(e.target.files[0])} />
			<button onClick={(e) => handleUpload(e)}>upload</button>
			<button onClick={(e) => handleConvert(e)}>convert</button>
		</div>
	);
}
