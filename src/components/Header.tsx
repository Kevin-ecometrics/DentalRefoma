import React, { useState, useRef } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

interface Link {
  id: string;
  label: string;
}

const Header: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<"es" | "en">("es");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
                  className="px-4 py-2 text-sm font-medium rounded-md transition-all text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Media and Language Selector */}
        <div className="hidden md:flex items-center gap-4">
          {/* Social Media */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/DentistaReforma"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-reforma" />
            </a>
            <a
              href="https://www.instagram.com/tuinstagram"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 transition-all"
              aria-label="Instagram"
            >
              <FaInstagram className="text-reforma" />
            </a>
          </div>

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
          {/* Logo */}
          <div className="absolute top-6 left-6">
            <a href="/" onClick={toggleMobileMenu}>
              <img
                src="/images/logo.webp"
                alt="Logo Clínica Dental"
                className="w-16 h-16"
                loading="lazy"
              />
            </a>
          </div>

          {/* Close Button */}
          <button
            onClick={toggleMobileMenu}
            className="absolute top-6 right-6 text-gray-700 hover:text-reforma focus:outline-none"
            aria-label="Close menu"
          >
            <HiX className="w-8 h-8" />
          </button>

          {/* Navigation Links */}
          <ul className="flex flex-col items-center gap-6">
            {links[currentLanguage].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-lg font-medium text-gray-700 hover:text-reforma transition-colors"
                  onClick={toggleMobileMenu}
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

          {/* Social Media */}
          <div className="flex items-center gap-4 mt-8">
            <a
              href="https://www.facebook.com/DentistaReforma"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-reforma" />
            </a>
            <a
              href="https://www.instagram.com/tuinstagram"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 transition-all"
              aria-label="Instagram"
            >
              <FaInstagram className="text-reforma" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
