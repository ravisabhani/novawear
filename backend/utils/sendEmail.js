import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Prefer SendGrid API key if provided (via SMTP relay)
  if (process.env.SENDGRID_API_KEY) {
    // SendGrid supports SMTP via smtp.sendgrid.net with user 'apikey' and the API key as password
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // If SMTP config is present use it
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Otherwise return a fake transporter that logs
  return {
    sendMail: async (opts) => {
      // eslint-disable-next-line no-console
      console.log('No SMTP configured — pretend sending mail:', JSON.stringify(opts));
      return Promise.resolve({ accepted: [opts.to] });
    },
  };
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@novawear.dev',
    to,
    subject,
    html,
    text,
  });

  return info;
};

export default sendEmail;
