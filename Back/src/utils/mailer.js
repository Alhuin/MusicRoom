import nodeMailer from "nodemailer";

let transporter = false;

function sendMail(mailOptions, resolve, reject) {

    // console.log('mailOptions : ');
    // console.log(mailOptions);
    if (!(transporter)) {
        transporter = nodeMailer.createTransport({
            service: "gmail",
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.GMAIL_USER, // generated ethereal user
                pass: process.env.GMAIL_PASSWORD, // generated ethereal password
            },
            pool: true, // use pooled connection
            maxConnections: 1, // set limit to 1 connection only
        });
        transporter.verify(function (error) {
            if (error) {
                console.error(error.msg);
            } else {
                console.log('Server is ready to take our messages');
            }
        });
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('sendMail 500');
            console.log(error);
            reject({
                status: 500,
                msg: error.name,
            })
        }
        else {
            console.log('Message sent: %s', info.messageId);
            resolve({
                status:200,
                data: {msg: 'An email has been sent to ' + mailOptions.to + '.'}
            });
        }
    });
}

export default sendMail

