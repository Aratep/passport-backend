const nodemailer = require('nodemailer');

function sendVerificationMail(user) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tepanyan95@gmail.com',
            pass: 'ara19950214320'
        }
    });

    let mailOptions = {
        from: 'ara.tepanyan.95@mail.ru',
        to: user.email,
        subject: 'Reset Password',
        html: `<b>${user.username}</b> Your password was changed successfully !!!`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendVerificationMail;