import nodeMailer from "nodemailer";
var transporter = false;

const initMailer = () => {

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
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    return transporter;
};

const sendMail = (res, to, subject, text) => {

    if (!(transporter)) {
        transporter = initMailer();
    }

    var mailOptions = {
        from: '"MusicRoom Team" <team@musicroom.com>',
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.log("500");
            res.status(500).send(error);
        }
        else {
            // console.log("200");
            res.status(200).send({msg: 'An email has been sent to ' + to + '.'});
            console.log('Message sent: %s', info.messageId);
        }
    });
};

export default sendMail

