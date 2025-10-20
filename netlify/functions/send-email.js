// This is a Netlify Function that runs on the server.
// It's designed to securely send an email when triggered.

// We are using the official SendGrid helper library to make sending emails easy.
const sgMail = require('@sendgrid/mail');

// Set the API key for SendGrid. It's securely read from the environment variables
// you set up in your Netlify dashboard.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This is the main function that Netlify will run.
exports.handler = async function(event, context) {
  // We only allow POST requests to this function for security.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the data sent from the inventory.html page.
    const { itemName, quantity, reorderLink } = JSON.parse(event.body);

    // Determine the subject line and body of the email based on the quantity.
    const subject = quantity === 0
      ? `URGENT: ${itemName} is OUT OF STOCK`
      : `ALERT: ${itemName} is LOW on stock`;

    const textBody = quantity === 0
      ? `${itemName} has run out of stock. Please reorder immediately.`
      : `${itemName} is running low. Only ${quantity} remaining in stock.`;

    const htmlBody = `
      <h1>Inventory Alert</h1>
      <p style="font-size: 16px;">${textBody}</p>
      ${reorderLink ? `<p style="font-size: 16px;"><strong>Reorder Link:</strong> <a href="${reorderLink}">${reorderLink}</a></p>` : ''}
      <p style="font-size: 12px; color: #888;">This is an automated notification from the MMF Maintenance Portal.</p>
    `;

    // Construct the email message object.
    const msg = {
      to: process.env.TO_EMAIL_ADDRESS,       // The recipient's email, from Netlify's environment variables.
      from: process.env.FROM_EMAIL_ADDRESS,   // The sender's email, from Netlify's environment variables.
      subject: subject,
      text: textBody,                         // Plain text version of the email.
      html: htmlBody,                         // HTML version of the email for better formatting.
    };

    // Use the SendGrid library to send the email.
    await sgMail.send(msg);

    // If the email sends successfully, return a success message.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    // If there's an error, log it to the Netlify function logs for debugging.
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    // Return an error message.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email.' }),
    };
  }
};
