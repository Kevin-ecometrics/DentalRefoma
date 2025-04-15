import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

interface Treatment {
  id: number;
  name: string;
  image: string;
  description: string;
}

const treatmentsES: Treatment[] = [
  {
    id: 1,
    name: "Endodoncia",
    image: "/images/endo.png",
    description: "Tratamiento para salvar dientes dañados o infectados."
  },
  {
    id: 2,
    name: "Ortodoncia",
    image: "/images/orto.png",
    description: "Corrección de dientes y mandíbulas posicionadas incorrectamente."
  },
  {
    id: 3,
    name: "Implantes",
    image: "/images/implante.png",
    description: "Reemplazo de dientes perdidos con raíces artificiales."
  },
  {
    id: 4,
    name: "Cirugía Oral",
    image: "/images/cirugia.png",
    description: "Procedimientos quirúrgicos para problemas bucales complejos."
  },
  {
    id: 5,
    name: "Prótesis",
    image: "/images/protesis.png",
    description: "Reemplazo de dientes faltantes con dispositivos personalizados."
  },
  {
    id: 6,
    name: "Coronas",
    image: "/images/corona.png",
    description: "Cubiertas protectoras para dientes dañados o débiles."
  },
  {
    id: 7,
    name: "Ortopediatra",
    image: "/images/orto.png",
    description: "Cuidado dental especializado para niños."
  },
  {
    id: 8,
    name: "Resinas",
    image: "/images/resinas.png",
    description: "Restauraciones estéticas para dientes dañados."
  },
  {
    id: 9,
    name: "Periodoncia",
    image: "/images/perio.png",
    description: "Tratamiento de encías y estructuras de soporte dental."
  }
];

const treatmentsEN: Treatment[] = [
  {
    id: 1,
    name: "Endodontics",
    image: "/images/endo.png",
    description: "Treatment to save damaged or infected teeth."
  },
  {
    id: 2,
    name: "Orthodontics",
    image: "/images/orto.png",
    description: "Correction of improperly positioned teeth and jaws."
  },
  {
    id: 3,
    name: "Implants",
    image: "/images/implante.png",
    description: "Replacement of missing teeth with artificial roots."
  },
  {
    id: 4,
    name: "Oral Surgery",
    image: "/images/cirugia.png",
    description: "Surgical procedures for complex oral problems."
  },
  {
    id: 5,
    name: "Prosthetics",
    image: "/images/protesis.png",
    description: "Replacement of missing teeth with custom devices."
  },
  {
    id: 6,
    name: "Crowns",
    image: "/images/corona.png",
    description: "Protective covers for damaged or weak teeth."
  },
  {
    id: 7,
    name: "Pediatric",
    image: "/images/orto.png",
    description: "Specialized dental care for children."
  },
  {
    id: 8,
    name: "Resins",
    image: "/images/resinas.png",
    description: "Aesthetic restorations for damaged teeth."
  },
  {
    id: 9,
    name: "Periodontics",
    image: "/images/perio.png",
    description: "Treatment of gums and dental support structures."
  }
];

const Services: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const isEnglish = typeof window !== "undefined" && window.location.pathname.startsWith("/en");
  const currentTreatments = isEnglish ? treatmentsEN : treatmentsES;
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(currentTreatments[0]);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const sectionTitle = isEnglish ? "Our Treatments" : "Nuestros Tratamientos";
  const sectionSubtitle = isEnglish
    ? "Professionals in your dental health"
    : "Profesionales en tu salud dental";
  const buttonText = isEnglish ? "Book Appointment" : "Agendar Cita";

  const scrollToReserva = () => {
    const reservaSection = document.getElementById('reserva');
    if (reservaSection) {
      reservaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevTreatment = () => {
    setDirection("left");
    const currentIndex = currentTreatments.findIndex(t => t.id === selectedTreatment.id);
    const prevIndex = (currentIndex - 1 + currentTreatments.length) % currentTreatments.length;
    setSelectedTreatment(currentTreatments[prevIndex]);
  };

  const handleNextTreatment = () => {
    setDirection("right");
    const currentIndex = currentTreatments.findIndex(t => t.id === selectedTreatment.id);
    const nextIndex = (currentIndex + 1) % currentTreatments.length;
    setSelectedTreatment(currentTreatments[nextIndex]);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="tratamientos" className="bg-[#f8fcec] py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {sectionTitle}
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12">
          {sectionSubtitle}
        </p>

        {!isMobile ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 border-r border-gray-300 pr-4 overflow-y-auto max-h-[600px]">
              {currentTreatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className={`flex items-center gap-4 p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedTreatment.id === treatment.id
                      ? "bg-[#9cc115] border-l-4 border-white shadow-lg text-white"
                      : "bg-white hover:shadow-md"
                  }`}
                  onClick={() => setSelectedTreatment(treatment)}
                >
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    className="w-12 h-12 object-contain"
                  />
                  <h3 className="text-lg font-semibold">{treatment.name}</h3>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <img
                  src={selectedTreatment.image}
                  alt={selectedTreatment.name}
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedTreatment.name}
                </h3>
                <div className="w-16 h-1 bg-[#9cc115] mx-auto mt-2"></div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                {selectedTreatment.description}
              </p>
              <button 
                onClick={scrollToReserva}
                className="block mx-auto bg-[#9cc115] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#7a9a12] transition-all"
              >
                {buttonText}
              </button>
            </div>
          </div>
        ) : (
<div className="flex flex-col items-center">
  <div className="w-full bg-white rounded-lg shadow-md p-6 mb-4">
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={selectedTreatment.id}
        custom={direction}
        initial={{ 
          x: direction === "right" ? 100 : -100,
          opacity: 0 
        }}
        animate={{ 
          x: 0,
          opacity: 1 
        }}
        exit={{ 
          x: direction === "right" ? -100 : 100,
          opacity: 0 
        }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <img
          src={selectedTreatment.image}
          alt={selectedTreatment.name}
          className="w-24 h-24 mx-auto mb-4"
        />
        <h3 className="text-2xl font-bold text-gray-800">
          {selectedTreatment.name}
        </h3>
        <div className="w-16 h-1 bg-[#9cc115] mx-auto mt-2 mb-4"></div>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          {selectedTreatment.description}
        </p>
        <button 
          onClick={scrollToReserva}
          className="mx-auto bg-[#9cc115] text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-[#7a9a12] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <FaCalendarAlt className="text-xs" />
          {buttonText}
        </button>
      </motion.div>
    </AnimatePresence>
  </div>

  <div className="flex justify-between w-full mt-4 mb-8 px-4">
    <button 
      onClick={handlePrevTreatment}
      className="flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
    >
      <img 
        src={currentTreatments[(currentTreatments.findIndex(t => t.id === selectedTreatment.id) - 1 + currentTreatments.length) % currentTreatments.length].image}
        alt="Previous"
        className="w-6 h-6 object-contain"
      />
      <span className="text-gray-700 font-medium text-sm">
        {currentTreatments[(currentTreatments.findIndex(t => t.id === selectedTreatment.id) - 1 + currentTreatments.length) % currentTreatments.length].name}
      </span>
    </button>
    
    <button 
      onClick={handleNextTreatment}
      className="flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
    >
      <span className="text-gray-700 font-medium text-sm">
        {currentTreatments[(currentTreatments.findIndex(t => t.id === selectedTreatment.id) + 1) % currentTreatments.length].name}
      </span>
      <img 
        src={currentTreatments[(currentTreatments.findIndex(t => t.id === selectedTreatment.id) + 1) % currentTreatments.length].image}
        alt="Next"
        className="w-6 h-6 object-contain"
      />
    </button>
  </div>
</div>
        )}
      </div>

    </section>
  );
};

export default Services;