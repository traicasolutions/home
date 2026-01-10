'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";

const basePath = process.env.NODE_ENV === 'production' ? '/home' : '';

export default function Home() {
  const [formStatus, setFormStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  // Load ad files from `/public/ads` via the server API. Falls back to a small hardcoded list on error.
  useEffect(() => {
    let mounted = true;

    async function loadAds() {
      try {
        // Fetch the static JSON file generated from the public/ads folder.
        const res = await fetch(`${basePath}/ads/ads.json`);
        if (!res.ok) throw new Error(`Static list not found: ${res.status}`);
        const files = await res.json();

        const adFiles = Array.isArray(files)
          ? files.filter((f) => /\.(png|jpe?g|svg)$/i.test(f))
          : [];

        const slidesList = adFiles.map((img) => ({
          src: `${basePath}/ads/${img}`,
          alt: img.replace(/\.[^.]+$/, ''),
          href: '#',
          caption: img.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          contain: true,
        }));

        if (mounted) setSlides(slidesList);
      } catch (err) {
        console.error('Failed to load static ads list:', err.message);
        // Fallback to a minimal set so the UI still shows something
        const fallback = ['1_yoga.png', 'AdvancedK8s.png', 'AdvancedGitOPs.png'];
        const slidesList = fallback.map((img) => ({
          src: `${basePath}/ads/${img}`,
          alt: img.replace(/\.[^.]+$/, ''),
          href: '#',
          caption: img.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          contain: true,
        }));
        if (mounted) setSlides(slidesList);
      }
    }

    loadAds();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const t = setInterval(() => setCurrentSlide((s) => (s + 1) % slides.length), 4500);
      return () => clearInterval(t);
    }
  }, [slides]);

  // Reset to first slide when slides change to avoid out-of-range index
  useEffect(() => {
    setCurrentSlide(0);
  }, [slides.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Validate that at least one course is selected
    const selectedCourses = formData.getAll('entry.1618973613');
    if (selectedCourses.length === 0) {
      setFormStatus('error');
      // Scroll modal to top to show error message
      document.querySelector(`.${styles.modalContent}`)?.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setFormStatus('');
      }, 5000);
      return;
    }

    try {
      // Submit to Google Forms in the background
      await fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      // Show success message
      setFormStatus('success');
      form.reset();

      // Scroll modal to top to show success message
      document.querySelector(`.${styles.modalContent}`)?.scrollTo({ top: 0, behavior: 'smooth' });

      // Hide message and close modal after 3 seconds
      setTimeout(() => {
        setFormStatus('');
        setShowModal(false);
      }, 3000);
    } catch (error) {
      setFormStatus('error');
      // Scroll modal to top to show error message
      document.querySelector(`.${styles.modalContent}`)?.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        setFormStatus('');
      }, 10000);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <img 
              src={`${basePath}/logo.png`}
              alt="Traica Solutions Logo" 
              className={styles.logoImage}
            />
          </div>
          <h2 className={styles.heroTitle}>
            <span className={styles.highlight}>The Logical Path to Solutions</span>
          </h2>
          <p className={styles.heroSubtitle}>
            Empowering innovation through Logic AI training, IT development, and intelligent test automation
          </p>
          <div className={styles.heroCta}>
            <button onClick={() => setShowModal(true)} className={styles.primaryBtn}>Register for Course</button>
            <a href="#contact" className={styles.secondaryBtn}>Get Started</a>
            <a href="#services" className={styles.secondaryBtn}>Learn More</a>
          </div>
        </div>
      </section>
      {/* Advertising / Slideshow Banner */}
      <section className={styles.adBanner} aria-label="Advertisement">
        <div className={styles.slideshow}>
          {(
            // Show yoga.png as default placeholder while ads load
            (slides.length > 0 ? slides : [{ src: `${basePath}/ads/yoga.png`, alt: 'yoga', href: '#', caption: 'yoga', contain: true }])
          ).map((slide, idx) => (
            <a
              key={idx}
              href={slide.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.slide} ${idx === currentSlide ? styles.active : ''}`}
            >
              <img src={slide.src} alt={slide.alt} className={`${styles.slideImage} ${slide.contain ? styles.slideContain : ''}`} />
            </a>
          ))}

          <div className={styles.dots}>
            {(slides.length > 0 ? slides : [{ src: `${basePath}/ads/yoga.png` }]).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSlide(idx);
                }}
                className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <p className={styles.sectionSubtitle}>Comprehensive solutions to drive your digital transformation</p>
          
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🎓</div>
              <h3>
                <a href="#training" style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}>
                  Professional Training
                </a>
              </h3>
              <p>
                Comprehensive training programs designed to upskill your team with cutting-edge 
                technologies and methodologies. From AI concepts to DevOps practices, we provide 
                hands-on learning experiences that drive real-world results.
              </p>
              <ul className={styles.serviceList}>
                <li>AI Concepts & Machine Learning</li>
                <li>AI-Powered Product Development & Testing</li>
                <li>DevOps & CI/CD Pipeline</li>
                <li>Test Automation & Quality Assurance</li>
                <li>Git, Docker & Kubernetes</li>
              </ul>
              <a href="#training" className={styles.viewCoursesBtn}>View All Courses →</a>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>⚙️</div>
              <h3>IT Development</h3>
              <p>
                Small-scale, high-impact IT solutions tailored to your business needs. 
                From web applications to custom software, we deliver quality solutions efficiently.
              </p>
              <ul className={styles.serviceList}>
                <li>Web & Mobile Development</li>
                <li>Custom Software Solutions</li>
                <li>API Development & Integration</li>
                <li>Cloud Solutions</li>
              </ul>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🔄</div>
              <h3>Testing & Automation</h3>
              <p>
                Streamline your workflows with intelligent test automation. We implement 
                robust testing frameworks that save time and ensure quality.
              </p>
              <ul className={styles.serviceList}>
                <li>Automated Testing Solutions</li>
                <li>CI/CD Pipeline Setup</li>
                <li>Quality Assurance Consulting</li>
                <li>Process Automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Training Courses Section */}
      <section id="training" className={styles.training}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Professional Training Courses</h2>
          <p className={styles.sectionSubtitle}>Explore our comprehensive training programs with detailed course brochures</p>
          
          <div className={styles.courseGrid}>
            {/* Course 1 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseBadge}>Advanced</div>
                <h3>Advanced DevOps with Kubernetes and Docker</h3>
              </div>
              <p className={styles.courseDescription}>
                Master advanced Kubernetes and Docker concepts including Helm charts, observability, 
                monitoring, and enterprise-grade container orchestration practices.
              </p>
              <ul className={styles.courseFeatures}>
                <li>Advanced Kubernetes Architecture</li>
                <li>Docker Multi-stage Builds & Optimization</li>
                <li>Helm Charts & Package Management</li>
                <li>Observability & Monitoring Tools</li>
                <li>Production Best Practices</li>
              </ul>
              <a 
                href={`${basePath}/brochures/Catalog_Kubernetes_with_Applied_DevOps.pdf`} 
                download
                className={styles.downloadBtn}
              >
                📥 Download Brochure
              </a>
            </div>

            {/* Course 2 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseBadge} style={{background: '#8DC63F'}}>Fresher Program</div>
                <h3>College to Corporate – DevOps Cloud Accelerator</h3>
              </div>
              <p className={styles.courseDescription}>
                Perfect for freshers! Learn DevOps fundamentals from scratch including Git, Docker, 
                Kubernetes, and observability with Grafana. Get job-ready with hands-on projects.
              </p>
              <ul className={styles.courseFeatures}>
                <li>Git Version Control Basics</li>
                <li>Docker Fundamentals & Containerization</li>
                <li>Kubernetes Essentials</li>
                <li>Grafana & Observability</li>
                <li>Real-world DevOps Projects</li>
              </ul>
              <a 
                href={`${basePath}/brochures/College to Corporate – DevOps  Cloud Accelerator Program.pdf`} 
                download
                className={styles.downloadBtn}
              >
                📥 Download Brochure
              </a>
            </div>

            {/* Course 3 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseBadge} style={{background: '#6FB33F'}}>Beginner</div>
                <h3>Basics of Python for Beginners</h3>
              </div>
              <p className={styles.courseDescription}>
                Start your programming journey with Python! Learn fundamental concepts and understand 
                how Python is used in organizations for automation, data analysis, and development.
              </p>
              <ul className={styles.courseFeatures}>
                <li>Python Syntax & Data Types</li>
                <li>Control Flow & Functions</li>
                <li>Object-Oriented Programming</li>
                <li>File Handling & Libraries</li>
                <li>Real-world Python Applications</li>
              </ul>
              <a 
                href={`${basePath}/brochures/Python_beginner_Catalog.pdf`} 
                download
                className={styles.downloadBtn}
              >
                📥 Download Brochure
              </a>
            </div>

            {/* Course 4 */}
            <div className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseBadge} style={{background: '#1B4965'}}>Complete Program</div>
                <h3>Beginner QA Engineer Training Programme</h3>
              </div>
              <p className={styles.courseDescription}>
                Comprehensive QA training covering testing fundamentals, requirement analysis, manual 
                and automation testing (Web, Android, API), non-functional testing, and security scans.
              </p>
              <ul className={styles.courseFeatures}>
                <li>Testing Fundamentals & SDLC</li>
                <li>Requirement Analysis & Test Generation</li>
                <li>Manual & Automation Testing</li>
                <li>Web, Android & API Testing</li>
                <li>Security Scans & Code Quality</li>
              </ul>
              <a 
                href={`${basePath}/brochures/Beginner-QA-Engineer-Training-Programme.pdf`} 
                download
                className={styles.downloadBtn}
              >
                📥 Download Brochure
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>About Us</h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h3>Innovating at the Intersection of AI and Automation</h3>
              <p>
                We are a forward-thinking startup dedicated to democratizing AI education 
                and delivering practical automation solutions. Our mission is to help 
                businesses and individuals harness the power of artificial intelligence 
                through comprehensive training and intelligent development practices.
              </p>
              <p>
                Whether you're looking to upskill your team in AI technologies or need 
                reliable IT development and testing support, we provide scalable solutions 
                that drive real results.
              </p>
            </div>
            <div className={styles.aboutStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>5+</div>
                <div className={styles.statLabel}>Years Experience</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>20+</div>
                <div className={styles.statLabel}>Projects Delivered</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Let's Work Together</h2>
          <p className={styles.sectionSubtitle}>
            Ready to transform your business with AI and automation?
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <div>
                <h4>Email</h4>
                <p>traicasolutions@gmail.com</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📞</span>
              <div>
                <h4>Phone</h4>
                <p>+91 63643 78919</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <div>
                <h4>Location</h4>
                <p>Bengaluru, India</p>
                <p className={styles.subText}>Remote & On-site Services Available</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>🔗</span>
              <div>
                <h4>Connect With Us</h4>
                <p>LinkedIn | Twitter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <p>&copy; 2025 Traica Solutions. All rights reserved. The Logical Path to Solutions.</p>
            <div className={styles.footerLinks}>
              <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
              <span className={styles.footerDivider}>•</span>
              <a href="#terms" className={styles.footerLink}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
              ✕
            </button>
            
            <h3 className={styles.modalTitle}>Register for a Course</h3>
            <p className={styles.modalSubtitle}>
              Interested in any of our training programs? Fill out the form below and we'll get back to you.
            </p>

            {formStatus === 'success' && (
              <div className={styles.successMessage}>
                ✅ Response recorded! Our executive will contact you with more details shortly.
              </div>
            )}

            {formStatus === 'error' && (
              <div className={styles.errorMessage}>
                ❌ Please select at least one course and fill all required fields.
              </div>
            )}

            <form 
              className={styles.registrationForm}
              action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdak2jiT3wdZtX8G_-nImaD_UwZd9zVp3D_wVWherrwF6FWZQ/formResponse"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full Name *</label>
                <input 
                  type="text" 
                  id="fullName"
                  name="entry.357958668"
                  placeholder="Enter your full name" 
                  className={styles.input}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email"
                  name="entry.1303140709"
                  placeholder="your.email@example.com" 
                  className={styles.input}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Contact Number *</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="entry.703271522"
                  placeholder="+91 XXXXX XXXXX" 
                  className={styles.input}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Select Courses * (You can select multiple)</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="entry.1618973613" value="IT YOGA Subscription" />
                    <span>IT YOGA Subscription</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="entry.1618973613" value="Advanced DevOps with Kubernetes and Docker" />
                    <span>Advanced DevOps with Kubernetes and Docker</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="entry.1618973613" value="GitOps Training Program" />
                    <span>GitOps Training Program</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="entry.1618973613" value="College to Corporate – DevOps Cloud Accelerator" />
                    <span>College to Corporate – DevOps Cloud Accelerator</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="entry.1618973613" value="Basics of Python for Beginners" />
                    <span>Basics of Python for Beginners</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="entry.1618973613" value="Beginner QA Engineer Training Programme" />
                    <span>Beginner QA Engineer Training Programme</span>
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Additional Message (Optional)</label>
                <textarea 
                  id="message"
                  name="entry.1935181999"
                  placeholder="Any questions or specific requirements?" 
                  className={styles.textarea}
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className={styles.registerBtn}>
                Register Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
