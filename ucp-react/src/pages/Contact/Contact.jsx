import { useRef, useState, useEffect } from 'react';
import { useReveal } from '../../hooks/useScrollEffects';
import { contactService } from "../../admin/services";
import styles from './Contact.module.css';

export default function Contact() {
  useReveal();
  const formRef = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pageData, setPageData] = useState({
    hero: { title: 'Contact Us', subtitle: 'Get in touch with us...', icon: '✉️' },
    contactInfo: { address: '', phone: '', email: '', postalCode: '' },
    emailSettings: { receiverEmail: '', subject: '', autoReply: '' },
    departments: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, deptRes] = await Promise.all([
          contactService.getContactPage(),
          contactService.getAcademicPrograms(),
        ]);

        const page = pageRes?.data || {};
        const departments = deptRes?.data || [];

        setPageData({
          hero: page.hero || {
            title: 'Contact Us',
            subtitle: 'Get in touch...',
            icon: '✉️',
          },
          contactInfo: page.contactInfo || {
            address: '',
            phone: '',
            email: '',
            postalCode: '',
          },
          emailSettings: page.emailSettings || {
            receiverEmail: '',
            subject: '',
            autoReply: '',
          },
          departments,
        });
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleMessageInput(e) {
    let value = e.target.value;

    if (value.length > 500) {
      value = value.slice(0, 500);
      e.target.value = value;
    }

    setCharCount(value.length);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const form = formRef.current;
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const phone = form.elements['phone'].value.trim();
    const city = form.elements['city'].value.trim();
    const interest = form.elements['interest'].value;
    const subject = form.elements['subject'].value.trim();
    const message = form.elements['message'].value.trim();

    if (!name || !email || !interest || !message) {
      alert('Please fill in all required fields (Name, Email, Academic Interest, Message).');
      return;
    }

    setIsSubmitting(true);

    try {
      await contactService.submitForm({
        name,
        email,
        phone,
        city,
        interest,
        subject,
        message,
      });

      const emailSubject = encodeURIComponent(
        pageData.emailSettings.subject || 'New Contact Inquiry'
      );

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\nInterest: ${interest}\n\nMessage:\n${message}`
      );

      const receiver =
        pageData.emailSettings.receiverEmail || 'Principal.rawalpindi@ucp.edu.pk';

      window.location.href = `mailto:${receiver}?subject=${emailSubject}&body=${body}`;

      alert('Your message has been sent! Your email client will open to review and send.');

      form.reset();
      setCharCount(0);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles['page-wrapper']}>
        <div className={styles['loading-spinner']}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  const { hero, contactInfo, departments, emailSettings } = pageData;

  return (
    <div className={styles['page-wrapper']}>
      <section className={styles.hero}>
        <div className={styles['hero-inner']}>
          <div className={styles.eyebrow}>
            <span className={styles.icon}>{hero.icon || '✉️'}</span> GET IN TOUCH
          </div>
          <h1>{hero.title || 'Contact Us'}</h1>
          <p>
            {hero.subtitle ||
              'Get in touch with UCP Rawalpindi for admissions, program details, and all academic inquiries.'}
          </p>
        </div>
      </section>

      <div className={styles['contact-body']}>
        <div className={styles['contact-inner']}>
          <div className={`${styles['form-card']} reveal reveal-up`}>
            <h2>Send Us a Message</h2>

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label>Full Name <span>*</span></label>
                  <input type="text" name="name" placeholder="Your full name" required />
                </div>

                <div className={styles['form-group']}>
                  <label>Email <span>*</span></label>
                  <input type="email" name="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={styles['form-group']}>
                  <label>Phone</label>
                  <input type="tel" name="phone" placeholder="+1 (555) 000-0000" />
                </div>

                <div className={styles['form-group']}>
                  <label>City</label>
                  <input type="text" name="city" placeholder="Your city" />
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={`${styles['form-group']} ${styles.full}`}>
                  <label>Academic Interest <span>*</span></label>
                  <select name="interest" defaultValue="" required>
                    <option value="" disabled>Select a program area</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles['form-row']}>
                <div className={`${styles['form-group']} ${styles.full}`}>
                  <label>Message <span>*</span></label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help..."
                    onInput={handleMessageInput}
                    required
                  ></textarea>
                  <div className={styles['char-note']}>
                    <span>{charCount}</span> / 500 characters
                  </div>
                </div>
              </div>

              <input
                type="hidden"
                name="subject"
                value={emailSettings.subject || 'New Contact Form Submission from UCP Website'}
                readOnly
              />

              <button
                type="submit"
                className={styles['btn-send']}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message ✉️'}
              </button>
            </form>
          </div>

          <div className={styles['info-stack']}>
            <div
              className={`${styles['info-card']} reveal reveal-right`}
              style={{ transitionDelay: '0.1s' }}
            >
              <div className={`${styles['info-icon']} ${styles['icon-blue-bg']}`}>📍</div>
              <h3>University Address</h3>
              <p>
                {contactInfo.address || 'D-464 6th Road, Rawalpindi'}<br />
                {contactInfo.postalCode || '46000'}
              </p>
            </div>

            <div
              className={`${styles['info-card']} reveal reveal-right`}
              style={{ transitionDelay: '0.2s' }}
            >
              <div className={`${styles['info-icon']} ${styles['icon-red-bg']}`}>📞</div>
              <h3>Phone &amp; Email</h3>
              <p>
                {contactInfo.phone || '(051) 4421672'}<br />
                {contactInfo.email || 'info@ucp.edu.pk'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}