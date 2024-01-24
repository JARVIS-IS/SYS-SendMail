const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

SYS_ManageData_Port = 3004;

function sendEmail(secret, email, htmlContent) {
	const transporter = nodemailer.createTransport({
		host: 'mail.infomaniak.com',
		port: 465,
		secure: true,
		auth: {
			user: secret.user,
			pass: secret.pass,
		},
	});

	const mailOptions = {
		from: secret.from,
		to: email,
		subject: secret.subject,
		html: htmlContent,
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
	fetch(`http://192.168.0.97:${SYS_ManageData_Port}`, {
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
		.then((data) => {});
}

app.post('/send', (req, res) => {
	let login = {
		user: process.env.USER,
		pass: process.env.PASS,
		from: process.env.FROM,
		subject: process.env.SUBJECT,
	};
	const htmlContent = fs.readFileSync('mail.html', 'utf-8');
	sendEmail(login, req.body.to, htmlContent.replace(/AUTHCODE/g, req.body.code));
	res.sendStatus(200);
});

app.post('/status', (req, res) => {
	res.sendStatus(200);
});

app.listen(port, () => console.log(`The SYS-SendMail server runs on port ${port}`));
