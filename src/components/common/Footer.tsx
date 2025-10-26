import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "#about" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Our Services", href: "#services" },
      { name: "Healthcare Workers", href: "#workers" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Contact Us", href: "#contact" },
    ],
    forPatients: [
      { name: "Find a Nurse", href: "/find-nurse" },
      { name: "Find a CHW", href: "/find-chw" },
      { name: "Book Appointment", href: "/book" },
      { name: "Patient Dashboard", href: "/patient" },
      { name: "Health Resources", href: "/resources" },
      { name: "FAQs", href: "/faqs" },
    ],
    forProfessionals: [
      { name: "Join as Nurse", href: "/register?role=nurse" },
      { name: "Join as CHW", href: "/register?role=chw" },
      { name: "Professional Dashboard", href: "/nurse" },
      { name: "Verification Process", href: "/verification" },
      { name: "Earnings", href: "/earnings" },
      { name: "Support Center", href: "/support" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "HIPAA Compliance", href: "/hipaa" },
      { name: "Refund Policy", href: "/refunds" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <footer className="w-full bg-gray-900 text-gray-300 px-4 md:px-8 lg:px-25">
      {/* Main Footer Content */}
      <div className="container-custom w-full py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 w-full">
          {/* Brand Column */}
          <div className="lg:col-span-2 w-full">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Heart className="w-full max-w-10 h-10 text-primary-500" />
              <span className="text-h5 font-bold text-white">Toltimed</span>
            </Link>
            <p className="text-body-sm text-gray-400 mb-6 w-full max-w-sm">
              Connecting families with certified healthcare professionals for
              quality, compassionate care at home. Available 24/7 across
              Nigeria.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-3">
                <Phone className="w-full max-w-5 h-5 text-primary-500 flex-shrink-0" />
                <a
                  href="tel:+2341234567890"
                  className="text-body-sm hover:text-primary-500 transition-colors"
                >
                  +234 123 456 7890
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-full max-w-5 h-5 text-primary-500 flex-shrink-0" />
                <a
                  href="mailto:support@toltimed.com"
                  className="text-body-sm hover:text-primary-500 transition-colors"
                >
                  support@toltimed.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-full max-w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <span className="text-body-sm">
                  123 Healthcare Avenue, Port Harcourt, Rivers State, Nigeria
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full max-w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-700 ${social.color}`}
                    aria-label={social.name}
                  >
                    <SocialIcon className="w-full max-w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div className="w-full">
            <h3 className="text-body-lg font-semibold text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2 w-full">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-body-sm text-gray-400 hover:text-primary-500 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Patients */}
          <div className="w-full">
            <h3 className="text-body-lg font-semibold text-white mb-4">
              For Patients
            </h3>
            <ul className="space-y-2 w-full">
              {footerLinks.forPatients.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-body-sm text-gray-400 hover:text-primary-500 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Professionals */}
          <div className="w-full">
            <h3 className="text-body-lg font-semibold text-white mb-4">
              For Professionals
            </h3>
            <ul className="space-y-2 w-full">
              {footerLinks.forProfessionals.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-body-sm text-gray-400 hover:text-primary-500 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="w-full">
            <h3 className="text-body-lg font-semibold text-white mb-4">
              Legal
            </h3>
            <ul className="space-y-2 w-full">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-body-sm text-gray-400 hover:text-primary-500 transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="mt-12 pt-8 border-t border-gray-800 w-full">
          <div className="max-w-2xl mx-auto text-center w-full">
            <h3 className="text-h5 font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-body-sm text-gray-400 mb-6">
              Subscribe to our newsletter for health tips, updates, and
              exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Subscribe
                <Send className="w-full max-w-4 h-4" />
              </button>
            </form>
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 w-full">
        <div className="container-custom w-full py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="text-body-sm text-gray-400 text-center md:text-left">
              © {currentYear} Toltimed. All rights reserved.
            </div>

            {/* Certifications/Badges */}
            {/* <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-full max-w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Heart className="w-full max-w-5 h-5 text-white" />
                </div>
                <span className="text-body-xs text-gray-400">
                  Healthcare Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full max-w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-full max-w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-body-xs text-gray-400">
                  Secure Platform
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
