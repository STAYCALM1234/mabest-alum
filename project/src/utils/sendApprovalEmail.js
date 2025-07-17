import emailjs from '@emailjs/browser';

export const sendApprovalEmail = async ({ name, email }) => {
  try {
    const response = await emailjs.send(
      'service_2f9fptk', // Your EmailJS service ID
      'template_lncgupr', // Your EmailJS template ID
      {
        name,
        email,
        company_name: 'Bright Alumni Network',
        website_link: 'https://your-alumni-site.com', // Replace with real link
        company_email: 'brightalumni@gmail.com',
      },
      'VB4nxAAU4cuBFIN1c' // Your EmailJS public key
    );
    console.log('✅ Email sent:', response.status);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
