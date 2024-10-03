import nodemailer from 'nodemailer';
import generateQRCode from './generateQRCode';

// create transporter object using the default SMTP transport

// send mail function
export default async function sendMail(config) {
  const { to, subject, text, html } = config;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.APP_PASSWORD 
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  let mailOptions = {
    from: process.env.EMAIL, 
    to, 
    subject, 
    text,
    html,
  };
  console.log('mails options from sendEmail code',mailOptions)

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}
