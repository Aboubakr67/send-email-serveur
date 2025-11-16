require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["POST"],
  })
);
app.use(express.json({ limit: "10kb" }));

// Rate limiting - max 5 emails par heure par IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  message: "Trop de requêtes, réessayez plus tard.",
});

app.post("/send-email", limiter, async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  // Configuration SMTP Hostinger
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // EMAIL 1 : Notification pour TOI
  const mailToYou = {
    from: process.env.EMAIL_USER,
    to: "aboubakr.zennir@gmail.com",
    subject: `📩 Nouveau message Portfolio - ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-block { background: #f8fafc; border-left: 4px solid #06b6d4; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .info-block strong { color: #0e7490; }
          .message-box { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .footer { background: #1e293b; color: #94a3b8; text-align: center; padding: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Nouveau Message Portfolio</h1>
          </div>
          <div class="content">
            <p>Tu as reçu un nouveau message depuis ton portfolio !</p>
            
            <div class="info-block">
              <strong>👤 Nom :</strong> ${firstName} ${lastName}
            </div>
            
            <div class="info-block">
              <strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="info-block">
              <strong>📝 Sujet :</strong> ${subject}
            </div>
            
            <div class="message-box">
              <strong style="color: #0e7490;">💬 Message :</strong>
              <p style="margin-top: 10px; line-height: 1.6; color: #334155;">${message.replace(
                /\n/g,
                "<br>"
              )}</p>
            </div>
            
          </div>
          <div class="footer">
            Portfolio Contact
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // EMAIL 2 : Auto-réponse pour l'EXPÉDITEUR
  const mailToSender = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `✅ Message bien reçu - Portfolio ZENNIR Aboubakr`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 40px; text-align: center; }
          .content { padding: 30px; color: #334155; line-height: 1.8; }
          .highlight { background: #ecfeff; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; font-weight: bold; }
          .footer { background: #1e293b; color: #94a3b8; text-align: center; padding: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Message bien reçu !</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${firstName}</strong>,</p>
            
            <p>Merci d'avoir pris le temps de me contacter via mon portfolio. J'ai bien reçu votre message concernant :</p>
            
            <div class="highlight">
              <strong>📝 Sujet :</strong> ${subject}
            </div>
            
            <p>Je m'engage à vous répondre dans les <strong>24-48 heures</strong>. Si votre demande est urgente, n'hésitez pas à me relancer.</p>
            
            <p style="margin-top: 30px;">À très bientôt ! 🚀</p>
            
            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
              <em>Cet email est une confirmation automatique. Merci de ne pas y répondre.</em>
            </p>
          </div>
          <div class="footer">
            Portfolio ZENNIR Aboubakr - Développeur Full Stack<br>
            📧 aboubakr.zennir@gmail.com
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    // Envoi des 2 emails
    await transporter.sendMail(mailToYou);
    await transporter.sendMail(mailToSender);

    console.log("✅ Emails envoyés avec succès");
    res.status(200).json({ message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Serveur sur http://localhost:${PORT}`);
});
