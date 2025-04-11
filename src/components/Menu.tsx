import React, { useState } from "react";
import {
  FaPlus,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

const DockMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const whatsappNumber = "5211234567890"; // Reemplaza con tu número de WhatsApp
  const whatsappMessage = "¡Hola! Me gustaría obtener más información."; // Mensaje predeterminado
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const emailAddress = "correo@ejemplo.com"; // Reemplaza con tu correo electrónico

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center">
      {/* Redes sociales (desplegables) */}
      <div
        className={`flex flex-col items-center space-y-4 mb-4 transition-all duration-500 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-110"
          aria-label="Facebook"
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-transform duration-300 hover:scale-110"
          aria-label="Instagram"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[#1EBE5D] transition-transform duration-300 hover:scale-110"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={20} />
        </a>
        <a
          href={`mailto:${emailAddress}`}
          className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform duration-300 hover:scale-110"
          aria-label="Correo electrónico"
        >
          <FaEnvelope size={20} />
        </a>
      </div>

      {/* Botón principal (Menú flotante) */}
      <button
        onClick={toggleMenu}
        className="bg-[#9cc115] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#7a9a12] transition-transform duration-300 hover:scale-110"
        aria-label="Abrir menú de redes sociales"
      >
        <FaPlus
          size={28}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
};

export default DockMenu;
