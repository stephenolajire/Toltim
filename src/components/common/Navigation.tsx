import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {Menu, X } from "lucide-react";


const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Healthcare Workers", href: "#workers" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  // Smooth scroll function
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const offsetTop = element.offsetTop - 80; // Adjust for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.replace("#", ""));
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 px-4 md:px-8 lg:px-25">
      <nav className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            onClick={(e) => scrollToSection(e, "#home")}
          >
            <img className="h-20" src="/logoo.png"/>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`text-body-base font-medium transition-colors hover:text-primary-600 ${
                  activeSection === item.href.replace("#", "")
                    ? "text-primary-600"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="btn-outline px-5 py-2.5">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-gray-100">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`block px-4 py-3 rounded-lg text-body-base font-medium transition-colors ${
                  activeSection === item.href.replace("#", "")
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </a>
            ))}

            <div className="pt-4 pb-2 space-y-2 border-t border-gray-100 mt-2">
              <Link
                to="/login"
                className="block text-center border-2 border-primary-500 text-primary-500 px-4 py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center bg-primary-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
