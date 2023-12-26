const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

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

app.post('', (req, res) => {
	sendEmail(req.body);
});

app.listen(port, () => console.log(`The SYS-SendMail server runs on port ${port}`));
