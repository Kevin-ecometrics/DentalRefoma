import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Slide {
  img: string;
  title: string;
  description: string;
  alt: string;
}

const slides: Slide[] = [
  {
    img: "images/solucion-bucal.jpg",
    title: "Todo problema bucal tiene una solución",
    description: "Atendemos todas las problemáticas de tu boca desde la raíz.",
    alt: "Solución integral para problemas bucales",
  },
  {
    img: "images/guarda-dental.jpg",
    title: "¿Te recomendaron una guarda?",
    description: "Protege tus dientes del bruxismo y el desgaste.",
    alt: "Guarda dental personalizada",
  },
  {
    img: "images/odontopediatria.jpg",
    title: "¿35 años atendiendo Emergencias infantiles?",
    description: "Odontopediatría especializada en que tus niños sonrían.",
    alt: "Atención dental para niños",
  },
];

const Carrousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const autoSlide = setInterval(nextSlide, 5000);
    return () => clearInterval(autoSlide);
  }, []);

  return (
    <div className="flex justify-center items-center w-full bg-gray-100 py-16 relative">
      <div className="relative max-w-5xl w-full overflow-hidden">
        {/* Título del carrusel */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-reforma mb-2">
            Nuestros Servicios
          </h3>
          <p className="text-lg text-gray-700">
            Soluciones integrales para cada necesidad dental
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
                <div className="w-full lg:w-1/3">
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="w-full h-40 lg:h-48 object-cover"
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
                    Agendar Cita
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Indicadores */}
          <div className="flex justify-center mt-6 gap-2">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
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
