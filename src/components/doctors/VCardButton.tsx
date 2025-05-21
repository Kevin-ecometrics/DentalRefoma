import React, { useState, useRef, useEffect } from "react";

interface VCardProps {
  nombre: string;
  titulo: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  direccion?: string;
  notaAdicional?: string;
  imagenUrl?: string;
}

export default function VCardButton({
  nombre,
  titulo,
  telefono = "+526631995492", // Número por defecto, puedes cambiarlo
  email = "pacientes@dentistareforma.com", // Email por defecto, puedes cambiarlo
  sitioWeb = "https://dentistareforma.com",
  direccion = "Av. Paseo Reforma 5304, La Esperanza, 22186 Tijuana, B.C.",
  notaAdicional = "",
  imagenUrl = "",
}: VCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if URL starts with "/en/doctores/"
    const currentPath = window.location.pathname;
    setIsEnglish(currentPath.startsWith("/en/doctores/"));

    // Función para cerrar el menú cuando se hace clic fuera de él
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (
        qrRef.current &&
        !qrRef.current.contains(event.target as Node) &&
        showQR
      ) {
        setShowQR(false);
      }
    }

    // Añadir el evento cuando el menú está activo
    if (showMenu || showQR) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, showQR]);

  // Text translations based on language
  const translations = {
    saveContact: isEnglish ? "Save Contact" : "Guardar Contacto",
    downloadVCF: isEnglish ? "Download VCF" : "Descargar VCF",
    generateQR: isEnglish ? "Generate QR Code" : "Generar código QR",
    qrCodeFor: isEnglish ? "QR Code - " : "Código QR - ",
    scanQR: isEnglish
      ? "Scan this QR code to save the contact on your device"
      : "Escanea este código QR para guardar el contacto en tu dispositivo",
  };

  const generateVCardData = () => {
    // Crear el contenido del vCard según la especificación
    let vCardData = "BEGIN:VCARD\n";
    vCardData += "VERSION:3.0\n";
    vCardData += `FN:${nombre}\n`;
    vCardData += `TITLE:${titulo}\n`;
    vCardData += `ORG:Dental Reforma\n`;

    if (telefono) {
      vCardData += `TEL;TYPE=WORK,VOICE:${telefono}\n`;
    }

    if (email) {
      vCardData += `EMAIL;TYPE=PREF,INTERNET:${email}\n`;
    }

    if (sitioWeb) {
      vCardData += `URL:${sitioWeb}\n`;
    }

    if (direccion) {
      vCardData += `ADR;TYPE=WORK:;;${direccion}\n`;
    }

    if (notaAdicional) {
      vCardData += `NOTE:${notaAdicional}\n`;
    }

    if (imagenUrl) {
      // Nota: Para incluir imágenes reales en vCard, se necesitaría codificar la imagen en base64
      // Aquí solo incluimos la URL, pero no se mostrará como imagen en la mayoría de aplicaciones
      vCardData += `PHOTO;VALUE=URL:${imagenUrl}\n`;
    }

    vCardData += "END:VCARD";

    return vCardData;
  };

  const downloadVCard = () => {
    const vCardData = generateVCardData();
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${nombre.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const showQRCode = () => {
    setShowQR(true);
    setShowMenu(false);
  };

  const generateQRCode = () => {
    // Utilizamos una API que permite superponer una imagen en el centro del QR
    const vCardData = encodeURIComponent(generateVCardData());

    // QR Monkey API con soporte para imagen central
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${vCardData}&ecc=M`;
  };

  // Función para mostrar el QR con el logo superpuesto
  const QRCodeWithLogo = () => {
    return (
      <div className="relative flex justify-center items-center">
        <img
          src={generateQRCode()}
          alt={isEnglish ? "QR code for contact" : "Código QR para contacto"}
          className="max-w-full h-auto"
        />
        <img
          src="/images/logofooter.webp"
          alt="Dental Reforma Logo"
          className="absolute w-16 h-16 object-contain"
          style={{
            borderRadius: "50%",
            backgroundColor: "white",
            padding: "4px",
          }}
        />
      </div>
    );
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
    if (showQR) setShowQR(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-6 py-3 bg-reforma text-white rounded-full font-semibold hover:bg-reforma-hover transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <polyline points="17 11 19 13 23 9"></polyline>
        </svg>
        {translations.saveContact}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${
            showMenu ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {showMenu && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={downloadVCard}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {translations.downloadVCF}
            </button>
            <button
              onClick={showQRCode}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              {translations.generateQR}
            </button>
          </div>
        </div>
      )}

      {showQR && (
        <div
          ref={qrRef}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {translations.qrCodeFor}
                {nombre}
              </h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <QRCodeWithLogo />
            </div>
            <p className="text-center text-gray-600 text-sm">
              {translations.scanQR}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
