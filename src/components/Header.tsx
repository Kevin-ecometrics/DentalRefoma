import React, { useState, useRef, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

interface Link {
  id: string;
  label: string;
}

const Header: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<"es" | "en">(
    window.location.pathname.startsWith("/en/") ? "en" : "es"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("home"); // Track the active link
  const navRef = useRef<HTMLUListElement>(null);

  const links: Record<"es" | "en", Link[]> = {
    es: [
      { id: "home", label: "Inicio" },
      { id: "mision", label: "Misión" },
      { id: "instalaciones", label: "Instalaciones" },
      { id: "tratamientos", label: "Tratamientos" },
      { id: "doctores", label: "Doctores" },
      { id: "reserva", label: "Reserva" },
      { id: "redes", label: "Redes" },
      { id: "ubicacion", label: "Cómo llegar" },
    ],
    en: [
      { id: "home", label: "Home" },
      { id: "mision", label: "Mission" },
      { id: "instalaciones", label: "Facilities" },
      { id: "tratamientos", label: "Treatments" },
      { id: "doctores", label: "Doctors" },
      { id: "reserva", label: "Booking" },
      { id: "redes", label: "Social Media" },
      { id: "ubicacion", label: "Location" },
    ],
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "es" ? "en" : "es";
    setCurrentLanguage(newLanguage);

    // Redirige a la ruta correspondiente
    if (newLanguage === "es") {
      window.location.pathname = "/"; // Redirige a la ruta raíz para español
    } else {
      window.location.pathname = "/en/"; // Redirige a la ruta /en/ para inglés
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (id: string) => {
    setActiveLink(id); // Update the active link when clicked
  };

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            setActiveLink(id); // Set the active link when the section is in view

            // Update the URL hash when the section is in view
            window.history.pushState(
              {},
              "",
              `#${id}` // Set the URL hash to the current section ID
            );
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the element is in the viewport
    );

    // Observe each section based on the ids
    links[currentLanguage].forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect(); // Clean up the observer on component unmount
    };
  }, [currentLanguage]); // Re-run this effect if the language changes

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <img
              src="/images/logo.webp"
              alt="Logo Clínica Dental"
              className="w-12 h-12"
              loading="lazy"
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow justify-center">
          <ul
            ref={navRef}
            className="flex items-center gap-6 transition-opacity duration-200"
          >
            {links[currentLanguage].map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  onClick={() => handleLinkClick(item.id)} // Set active link on click
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all text-gray-700 hover:bg-gray-100 ${
                    activeLink === item.id ? "bg-reforma text-white" : ""
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media and Language Selector */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div
            onClick={toggleLanguage}
            className="relative w-20 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center transition-all duration-300"
          >
            <div
              className={`absolute w-8 h-8 bg-reforma rounded-full shadow-md transform transition-transform duration-300 ${
                currentLanguage === "es" ? "translate-x-0" : "translate-x-12"
              }`}
            ></div>
            <span
              className={`absolute left-2 text-sm font-medium transition-opacity duration-300 ${
                currentLanguage === "es"
                  ? "opacity-100 text-white"
                  : "opacity-50 text-gray-600"
              }`}
            >
              ES
            </span>
            <span
              className={`absolute right-2 text-sm font-medium transition-opacity duration-300 ${
                currentLanguage === "en"
                  ? "opacity-100 text-white"
                  : "opacity-50 text-gray-600"
              }`}
            >
              EN
            </span>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-reforma focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-8 h-8" />
            ) : (
              <HiMenu className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          {/* Navigation Links */}
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-reforma focus:outline-none"
              aria-label="Close menu"
            >
              <HiX className="w-8 h-8" />
            </button>
          </div>
          <ul className="flex flex-col items-center gap-6">
            {links[currentLanguage].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    handleLinkClick(item.id); // Set active link on click
                    toggleMobileMenu(); // Close mobile menu
                  }}
                  className={`text-lg font-medium text-gray-700 hover:text-reforma transition-colors ${
                    activeLink === item.id ? "bg-reforma text-white" : ""
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Language Selector */}
          <div
            onClick={toggleLanguage}
            className="relative w-20 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center mt-8 transition-all duration-300"
          >
            <div
              className={`absolute w-8 h-8 bg-reforma rounded-full shadow-md transform transition-transform duration-300 ${
                currentLanguage === "es" ? "translate-x-0" : "translate-x-12"
              }`}
            ></div>
            <span
              className={`absolute left-2 text-sm font-medium transition-opacity duration-300 ${
                currentLanguage === "es"
                  ? "opacity-100 text-white"
                  : "opacity-50 text-gray-600"
              }`}
            >
              ES
            </span>
            <span
              className={`absolute right-2 text-sm font-medium transition-opacity duration-300 ${
                currentLanguage === "en"
                  ? "opacity-100 text-white"
                  : "opacity-50 text-gray-600"
              }`}
            >
              EN
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
