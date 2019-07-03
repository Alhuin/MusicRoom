import nodeMailer from "nodemailer";
var transporter = false;

function initMailer() {

    const transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'f95c1b9bdecaa5', // generated ethereal user
            pass: '749f167913a5e1' // generated ethereal password
        }
    });

    transporter.verify(function (error) {
        if (error) {
            console.error(error.msg);
        } else {
            // console.log('Server is ready to take our messages');
        }
    });

    return transporter;
}

function sendMail(mailOptions, resolve, reject) {

    if (!(transporter)) {
        transporter = initMailer();
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            reject({
                status: 500,
                msg: err.msg,
            })
        }
        else {
            // console.log('Message sent: %s', info.messageId);
            resolve({
                status:200,
                data: {msg: 'An email has been sent to ' + mailOptions.to + '.'}
            });
        }
    });
}

export default sendMail

