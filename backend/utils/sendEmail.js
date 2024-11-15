const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com', 
			port: 587,
			secure: false,
            requireTLS : true,
			auth: {
				user: "kedarnathrothe2003@gmail.com",
				pass: 'scmpzcmtrocqcvbv',
			},
		});

		await transporter.sendMail({
			from: 'kedarnathrothe2003@gmail.com',
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
