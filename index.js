const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

SYS_ManageData_Port = 3002;

function sendEmail(content) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: content.user,
			pass: content.path,
		},
	});

	const mailOptions = {
		from: content.from,
		to: content.to,
		subject: content.subject,
		text: content.text,
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
	fetch(`http://localhost:${SYS_SendMail_Port}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			token: info.token,
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			sendEmail(data);
		});
}

app.post('', (req, res) => {
	getInfo(req.body);
});

app.listen(port, () => console.log(`The SYS-SendMail server runs on port ${port}`));
