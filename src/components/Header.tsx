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
      { id: "home", label: "Inicio", title: "Inicio" },
      { id: "mision", label: "Misión", title: "Misión" },
      { id: "instalaciones", label: "Instalaciones", title: "Instalaciones" },
      { id: "tratamientos", label: "Tratamientos", title: "Tratamientos" },
      { id: "doctores", label: "Doctores", title: "Doctores" },
      { id: "reserva", label: "Reserva", title: "Reserva" },
      { id: "ubicacion", label: "Ubicación", title: "Ubicación" },
    ],
    en: [
      { id: "home", label: "Home", title: "Home" },
      { id: "mision", label: "Mission", title: "Mission" },
      { id: "instalaciones", label: "Facilities", title: "Facilities" },
      { id: "tratamientos", label: "Treatments", title: "Treatments" },
      { id: "doctores", label: "Doctors", title: "Doctors" },
      { id: "reserva", label: "Booking", title: "Booking" },
      { id: "ubicacion", label: "Location", title: "Location" },
    ],
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = links[currentLanguage].map((link) =>
        document.getElementById(link.id)
      );

      let newActiveLink = activeLink; // para evitar llamadas repetidas si no cambia

      sections.forEach((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            newActiveLink = section.id;
          }
        }
      });

      if (newActiveLink !== activeLink) {
        setActiveLink(newActiveLink);

        // Actualizar el hash sin recargar ni agregar historial nuevo
        if (window.location.hash !== `#${newActiveLink}`) {
          window.history.replaceState(null, "", `#${newActiveLink}`);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentLanguage, activeLink, links]);

  const toggleLanguage = () => {
    const newLang = currentLanguage === "es" ? "en" : "es";
    setCurrentLanguage(newLang);

    const { hash, pathname } = window.location;

    let newPath =
      newLang === "es"
        ? pathname.replace(/^\/en/, "") || "/"
        : "/en" + pathname;

    // Concatenamos hash para conservarlo
    const fullPath = newPath + hash;

    setTimeout(() => {
      // Cambia la ruta manualmente con hash
      window.location.href = fullPath;
    }, 200);
  };

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    localStorage.setItem("mobileMenuOpen", JSON.stringify(newState));
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-white shadow-md"
          : "bg-white/90 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.a
          title="logo"
          aria-label="logo"
          href="#home"
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            title="logo"
            src="/images/logo.webp"
            alt="Logo"
            className="h-10 w-auto"
          />
        </motion.a>

        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1">
            {links[currentLanguage].map((link) => (
              <motion.a
                title="link.title"
                aria-label="link.title"
                key={link.id}
                href={`#${link.id}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeLink === link.id
                    ? "bg-[#aed136] text-white"
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
          <div
            onClick={toggleLanguage}
            className="relative flex items-center bg-gray-200 rounded-full p-1 cursor-pointer"
          >
            <motion.div
              className="absolute top-0 left-0 h-full w-1/2 bg-white rounded-full shadow-sm"
              animate={{ x: currentLanguage === "es" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <div className="relative z-10 flex w-full text-xs font-medium">
              <span
                className={`w-10 text-center px-2 py-1 transition-colors duration-200 ${
                  currentLanguage === "es" ? "text-black" : "text-gray-500"
                }`}
              >
                ES
              </span>
              <span
                className={`w-10 text-center px-2 py-1 transition-colors duration-200 ${
                  currentLanguage === "en" ? "text-black" : "text-gray-500"
                }`}
              >
                EN
              </span>
            </div>
          </div>
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
              title="header"
              aria-label="header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-10 md:hidden"
              onClick={toggleMenu}
            />

            <motion.div
              title="header"
              aria-label="header"
              initial={{ x: "100%" }}
              animate={{ x: "3%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-[60%] h-full bg-white shadow-xl z-[9999] md:hidden"
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
                      title={link.title}
                      aria-label={link.title}
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={() => {
                        setActiveLink(link.id);
                        setIsMenuOpen(false);
                      }}
                      className={`block px-4 py-3 text-base font-medium rounded-lg mb-1 ${
                        activeLink === link.id
                          ? "bg-[#aed136] text-white"
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
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-reforma-background text-gray-700 font-medium rounded-lg px-4 py-3 transition-colors duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Toggle language"
                  >
                    <FaGlobeAmericas className="text-xl text-[#aed136]" />
                    {currentLanguage === "es"
                      ? "Cambiar a inglés"
                      : "Switch to Spanish"}
                  </motion.button>
                </div>
                <div className="">
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="text-center text-sm text-gray-500">
                      {currentLanguage === "es" ? (
                        <p>
                          © {new Date().getFullYear()} Dental Reforma. Todos los
                          derechos reservados. <br />
                          Diseñado por{" "}
                          <a
                            href="https://ecommetrica.com/"
                            className="text-[#aed136] hover:underline"
                          >
                            Ecommetrica
                          </a>
                          .
                        </p>
                      ) : (
                        <p>
                          © {new Date().getFullYear()} Dental Reforma. All
                          rights reserved. <br />
                          Designed by{" "}
                          <a
                            href="https://ecommetrica.com/"
                            className="text-[#aed136] hover:underline"
                          >
                            Ecommetrica
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  </div>
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
