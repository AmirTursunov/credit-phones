import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPaymentReminder(
  customerEmail: string,
  customerName: string,
  phoneModel: string,
  amount: number,
  paymentDate: string
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: "⏰ To'lov eslatmasi - Kredit Telefon",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .amount { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
          .info { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>📱 To'lov Eslatmasi</h1></div>
          <div class="content">
            <p>Hurmatli <strong>${customerName}</strong>,</p>
            <p>Sizning <strong>${phoneModel}</strong> uchun kredit to'lovingiz muddati yetib keldi.</p>
            <div class="amount">${(amount / 1000000).toFixed(
              1
            )} million so'm</div>
            <div class="info">
              <p><strong>📅 To'lov sanasi:</strong> ${paymentDate}</p>
              <p><strong>📱 Telefon:</strong> ${phoneModel}</p>
              <p><strong>💰 Summa:</strong> ${amount.toLocaleString(
                "uz-UZ"
              )} so'm</p>
            </div>
            <p>Hurmat bilan, Kredit Telefon jamoasi</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email xato:", error);
    return { success: false, error };
  }
}
