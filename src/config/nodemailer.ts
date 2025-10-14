import nodemailer from 'nodemailer';

const { EMAIL_SERVICE_USER, EMAIL_SERVICE_PASSWORD } = process.env;

if (!EMAIL_SERVICE_USER || !EMAIL_SERVICE_PASSWORD) {
  throw new Error("Email service credentials are not set in environment variables");
}

export const sendVerificationEmail = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_SERVICE_USER,
      pass: EMAIL_SERVICE_PASSWORD,
    }
  });

  const mailOptions = {
    from: `EchoRank <${EMAIL_SERVICE_USER}>`,
    to: to,
    subject: 'Email Verification',
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      throw new Error('Failed to send verification email');
    } else {
      console.log('Email sent: ' + info.response);
      return info;
    }
  });
}