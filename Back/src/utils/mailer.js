import nodeMailer from 'nodemailer';
import CustomError from '../services/errorHandler';

let transporter = false;

function sendMail(mailOptions, resolve, reject) {
  if (!(transporter)) {
    transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true, // use pooled connection
      maxConnections: 1, // set limit to 1 connection only
    });
    transporter.verify((error) => {
      if (error) {
        reject(new CustomError(error, 500));
      } else {
        console.log('Server is ready to take our messages');
      }
    });
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      reject(new CustomError(error, 500));
    } else {
      console.log('Message sent: %s', info.messageId);
      resolve({
        status: 202,
        data: { msg: `An email has been sent to ${mailOptions.to}` },
      });
    }
  });
}

export default sendMail;
