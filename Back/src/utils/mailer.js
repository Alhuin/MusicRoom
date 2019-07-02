import nodeMailer from "nodemailer";
var transporter = false;

function initMailer() {

    const transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '4234ef9be3c4ef', // generated ethereal user
            pass: '0170cf1096bdef' // generated ethereal password
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
};

function sendMail(mailOptions, resolve, reject) {

    if (!(transporter)) {
        transporter = initMailer();
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
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
};

export default sendMail

