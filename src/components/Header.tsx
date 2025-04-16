import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { FaGlobeAmericas } from "react-icons/fa";

const Header: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<"es" | "en">(
    window.location.pathname.startsWith("/en/") ? "en" : "es"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  const links = {
    es: [
      { id: "home", label: "Inicio" },
      { id: "mision", label: "Misión" },
      { id: "instalaciones", label: "Instalaciones" },
      { id: "tratamientos", label: "Tratamientos" },
      { id: "doctores", label: "Doctores" },
      { id: "reserva", label: "Reserva" },
      { id: "ubicacion", label: "Ubicación" }
    ],
    en: [
      { id: "home", label: "Home" },
      { id: "mision", label: "Mission" },
      { id: "instalaciones", label: "Facilities" },
      { id: "tratamientos", label: "Treatments" },
      { id: "doctores", label: "Doctors" },
      { id: "reserva", label: "Booking" },
      { id: "ubicacion", label: "Location" }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      const sections = links[currentLanguage].map(link => document.getElementById(link.id));
      sections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentLanguage]);

  const toggleLanguage = () => {
    const newLang = currentLanguage === "es" ? "en" : "es";
    setCurrentLanguage(newLang);
    window.location.pathname = newLang === "es" ? "/" : "/en/";
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.a
          href="#home"
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/images/logo.webp" 
            alt="Logo" 
            className="h-10 w-auto"
          />
        </motion.a>

        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1">
            {links[currentLanguage].map((link) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeLink === link.id 
                    ? "bg-[#9cc115] text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </nav>

        <div className="hidden md:flex items-center">
          <motion.button
            onClick={toggleLanguage}
            className="flex items-center text-gray-700 hover:text-[#9cc115] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGlobeAmericas className="mr-1" />
            <span className="text-sm font-medium">
              {currentLanguage === "es" ? "ES" : "EN"}
            </span>
            <HiChevronDown className="ml-1" />
          </motion.button>
        </div>

        <motion.button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? (
            <HiX className="w-6 h-6 text-gray-700" />
          ) : (
            <HiMenu className="w-6 h-6 text-gray-700" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[9998] md:hidden"
              onClick={toggleMenu}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "3%" }}  
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-xl z-[9999] md:hidden"
            >
              <div className="h-full flex flex-col">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Menú</span>
                  <button
                    onClick={toggleMenu}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <HiX className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2">
                  {links[currentLanguage].map((link) => (
                    <motion.a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={() => {
                        setActiveLink(link.id);
                        setIsMenuOpen(false);
                      }}
                      className={`block px-4 py-3 text-base font-medium rounded-lg mb-1 ${
                        activeLink === link.id
                          ? "bg-[#9cc115] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-gray-200">
                  <motion.button
                    onClick={toggleLanguage}
                    className="w-full px-4 py-3 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaGlobeAmericas className="mr-2" />
                    {currentLanguage === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;