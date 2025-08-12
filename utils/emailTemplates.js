const getContactFormEmailTemplate = (
  firstName,
  lastName,
  email,
  phone,
  subject,
  message
) => {
  return `
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
    <div style="max-width:600px; margin:20px auto; background-color:#ffffff; overflow:hidden; box-shadow:0 4px 24px rgba(0, 0, 0, 0.05); border:1px solid #e2e8f0;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff7a00 0%, #ff5500 100%); padding:32px 20px; text-align:center;">
        <h1 style="margin:0; font-size:28px; font-weight:600; color:#ffffff; letter-spacing:-0.5px;">SOHCAHTOA</h1>
        <p style="margin:4px 0 0; font-size:16px; font-weight:400; color:rgba(255,255,255,0.9);">Payout BDC Contact Form Submission</p>
      </div>

      <!-- Content -->
      <div style="padding:32px 28px; color:#0f172a;">
        <p style="margin:0 0 24px; font-size:18px; line-height:1.6;">
          Hello Admin,  
          You have received a new contact message from the SohCahToa website.
        </p>

        <div style="background:#fff7f0; border-radius:8px; padding:16px; margin-bottom:24px;">
          <p style="margin:0; font-size:16px;"><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p style="margin:0; font-size:16px;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0; font-size:16px;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin:0; font-size:16px;"><strong>Subject:</strong> ${subject}</p>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
          <p style="margin:0 0 8px; font-size:16px; font-weight:600; color:#ff7a00;">Message:</p>
          <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">${message}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#f8fafc; padding:24px; text-align:center; border-top:1px solid #e2e8f0;">
        <p style="margin:0 0 12px; font-size:14px; color:#64748b;">
          &copy; ${new Date().getFullYear()} SohCahToa. All rights reserved.
        </p>
      </div>
    </div>
  </body>
`;
};

const getContactAcknowledgmentEmailTemplate = (firstName) => {
  return `
  <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
    <div style="max-width:600px; margin:20px auto; background-color:#ffffff; overflow:hidden; box-shadow:0 4px 24px rgba(0, 0, 0, 0.05); border:1px solid #e2e8f0;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff7a00 0%, #ff5500 100%); padding:32px 20px; text-align:center;">
        <h1 style="margin:0; font-size:28px; font-weight:600; color:#ffffff; letter-spacing:-0.5px;">SOHCAHTOA</h1>
        <p style="margin:4px 0 0; font-size:16px; font-weight:400; color:rgba(255,255,255,0.9);">Payout BDC Support</p>
      </div>

      <!-- Content -->
      <div style="padding:32px 28px; color:#0f172a;">
        <p style="margin:0 0 24px; font-size:18px; line-height:1.6;">
          Hi <strong style="font-weight:600;">${firstName}</strong>,
        </p>

        <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
          Thank you for reaching out to <strong style="color:#ff7a00;">SohCahToa</strong>.  
          We have received your message and our team is currently reviewing it.
        </p>

        <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
          You can expect a response from us as soon as possible. In the meantime, feel free to explore our website for more resources or updates.
        </p>

        <div style="background:#fff7f0; border-radius:8px; padding:16px; margin-top:24px; text-align:center;">
          <p style="margin:0; font-size:15px; color:#ff7a00; font-weight:500;">
            If your inquiry is urgent, please contact us directly at  
            <a href="mailto:support@sohcahtoa.com" style="color:#ff5500; text-decoration:none;">support@sohcahtoa.com</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#f8fafc; padding:24px; text-align:center; border-top:1px solid #e2e8f0;">
        <p style="margin:0; font-size:14px; color:#64748b;">
          &copy; ${new Date().getFullYear()} SohCahToa. All rights reserved.
        </p>
      </div>
    </div>
  </body>
`;
};

module.exports = {
  getContactFormEmailTemplate,
  getContactAcknowledgmentEmailTemplate,
};
