const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

SYS_ManageData_Port = 3004;

function sendEmail(content, email, text) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: content.user,
			pass: content.pass,
		},
	});

	const mailOptions = {
		from: content.from,
		to: email,
		subject: content.subject,
		text: text,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.error(error);
		} else {
			console.log('E-mail envoyé: ' + info.response);
		}
	});
}

async function getInfo(info) {
	fetch(`http://192.168.0.79:${SYS_ManageData_Port}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			token: info.token,
			type: info.type,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			sendEmail(JSON.parse(data), info.email, info.text);
		});
}

app.post('', (req, res) => {
	getInfo(req.body);
});

app.listen(port, () => console.log(`The SYS-SendMail server runs on port ${port}`));
