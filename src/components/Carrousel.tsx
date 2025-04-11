import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Slide {
  img: string;
  title: string;
  description: string;
  alt: string;
}

const slidesES: Slide[] = [
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/237902_610886.png",
    title: "Todo problema bucal tiene una solución",
    description: "Atendemos todas las problemáticas de tu boca desde la raíz.",
    alt: "Solución integral para problemas bucales",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/462545_623754.png",
    title: "¿Te recomendaron una guarda?",
    description: "Protege tus dientes del bruxismo y el desgaste.",
    alt: "Guarda dental personalizada",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/469513_798641.png",
    title: "¿35 años atendiendo Emergencias infantiles?",
    description: "Odontopediatría especializada en que tus niños sonrían.",
    alt: "Atención dental para niños",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/586984_902110.png",
    title: "¿Síntomas de Hipersensibilidad?",
    description:
      "Vuelve a disfrutar de la comida y bebida que tanto te gusta atendiendo tu esmalte.",
    alt: "Tratamiento para sensibilidad dental",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/920394_354067.png",
    title: "¿Con miedo al dentista?",
    description: "Encuentra la calidez y ternura donde el paciente es primero.",
    alt: "Atención dental sin miedo",
  },
];

const slidesEN: Slide[] = [
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/237902_610886.png",
    title: "Every dental problem has a solution",
    description: "We treat all oral issues from the root.",
    alt: "Comprehensive solutions for oral problems",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/462545_623754.png",
    title: "Were you recommended a night guard?",
    description: "Protect your teeth from grinding and wear.",
    alt: "Custom night guard",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/469513_798641.png",
    title: "35 years treating kids’ emergencies?",
    description: "Pediatric dentistry that makes your kids smile.",
    alt: "Dental care for children",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/586984_902110.png",
    title: "Sensitive teeth?",
    description:
      "Enjoy your favorite food and drinks again by taking care of your enamel.",
    alt: "Sensitivity treatment",
  },
  {
    img: "https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/1363639/920394_354067.png",
    title: "Afraid of the dentist?",
    description: "Warmth and care where the patient always comes first.",
    alt: "Fear-free dental care",
  },
];

const Carrousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsEnglish(window.location.pathname.startsWith("/en"));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const autoSlide = setInterval(nextSlide, 5000);
    return () => clearInterval(autoSlide);
  }, []);

  const slides = isEnglish ? slidesEN : slidesES;

  return (
    <div className="flex justify-center items-center w-full bg-gray-100 py-16 relative">
      <div className="relative max-w-5xl w-full overflow-hidden">
        {/* Título del carrusel */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-reforma mb-2">
            {isEnglish ? "Our Services" : "Nuestros Servicios"}
          </h3>
          <p className="text-lg text-gray-700">
            {isEnglish
              ? "Comprehensive solutions for every dental need"
              : "Soluciones integrales para cada necesidad dental"}
          </p>
        </div>

        {/* Contenedor de las tarjetas */}
        <div className="relative">
          <div
            className="flex transition-transform duration-700"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full flex flex-col lg:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Imagen */}
                <div className="w-full">
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="w-full object-cover"
                  />
                </div>
                {/* Contenido */}
                <div className="w-full lg:w-2/3 p-4">
                  <h3 className="text-lg font-semibold text-reforma mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    {slide.description}
                  </p>
                  <a
                    href="#contacto"
                    className="inline-block bg-reforma text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-reforma-hover transition-transform duration-300 hover:-translate-y-1"
                  >
                    {isEnglish ? "Book Appointment" : "Agendar Cita"}
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Indicadores */}
          <div className="flex justify-center mt-6 mb-6 gap-2">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                  index === currentIndex
                    ? "bg-reforma scale-125"
                    : "bg-gray-300"
                }`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <button
          className="bg-white text-reforma w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-reforma hover:text-white transition-all"
          onClick={prevSlide}
        >
          <FaChevronLeft size={20} />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <button
          className="bg-white text-reforma w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-reforma hover:text-white transition-all"
          onClick={nextSlide}
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Carrousel;
