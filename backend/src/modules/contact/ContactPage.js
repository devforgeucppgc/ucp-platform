const mongoose = require('mongoose');

const contactPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Contact Us' },
      subtitle: { type: String, default: 'Get in touch with UCP Rawalpindi...' },
      icon: { type: String, default: '✉️' },
    },
    contactInfo: {
      address: { type: String, default: 'D-464 6th Road, Rawalpindi' },
      phone: { type: String, default: '(051) 4421672' },
      email: { type: String, default: 'info@ucp.edu.pk' },
      postalCode: { type: String, default: '46000' },
    },
    emailSettings: {
      receiverEmail: { type: String, default: 'syedashahnoor1412@gmail.com' },
      subject: { type: String, default: 'New Contact Inquiry' },
      autoReply: {
        type: String,
        default: "Thank you for reaching out. We'll get back to you soon.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactPage', contactPageSchema);