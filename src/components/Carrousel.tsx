import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaTooth } from "react-icons/fa";

interface Slide {
  img: string;
  title: string;
  description: string;
  alt: string;
  icon?: React.ReactNode;
}

const slidesES = [
  {
    title: "Técnica de Cepillado Perfecto",
    description: "Aprende el método de cepillado que recomiendan los odontólogos: usa movimientos suaves y circulares, inclinando el cepillo 45° hacia las encías. No olvides la lengua y mínimo 2 minutos, 3 veces al día. ¡Tu sonrisa lo vale!",
    img: "images/cepillo.webp",
    alt: "Técnica de cepillado perfecto",
    cta: "Agendar limpieza dental",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "El Dentista Sin Dolor Existe",
    description: "Olvida los mitos: la odontología moderna usa técnicas indoloras y sedación consciente. Nuestro enfoque humanizado reduce el estrés en un 80%.",
    img: "images/miedo.webp",
    alt: "Dentista sin dolor",
    cta: "Supera tu miedo ahora",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "Soluciones Integrales",
    description: "Desde caries complejas hasta reconstrucciones completas. Evaluamos 32 aspectos de tu salud bucal con tecnología 3D para crear un plan personalizado. Más de 200 casos exitosos en el último año.",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    cta: "Evaluación completa",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "Sensibilidad Dental",
    description: "¿Dolor con lo frío/caliente? Solucionamos la hipersensibilidad en 1-2 sesiones con nuestros tratamientos con láser y nanopartículas de flúor. Eficacia comprobada del 95% según estudios clínicos.",
    img: "images/sensibilidad.webp",
    alt: "Sensibilidad dental",
    cta: "Alivia tu sensibilidad",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "Odontopediatría Especializada",
    description: "Nuestro 'rincón mágico' hace que los niños amen sus visitas. Detectamos problemas tempranos con juegos interactivos y usamos materiales biocompatibles. Programa su primera experiencia positiva.",
    img: "images/nino.webp",
    alt: "Odontopediatría especializada",
    cta: "Cita para tu pequeño",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  }
];

const slidesEN = [
  {
    title: "Perfect Brushing Technique",
    description: "Learn the dentist-recommended method: use gentle circular motions, tilting the brush 45° toward gums. Don't forget your tongue and brush for at least 2 minutes, 3 times daily. Your smile deserves it!",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    cta: "Book dental cleaning",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "Pain-Free Dentistry is Real",
    description: "Forget the myths: modern dentistry uses painless techniques and conscious sedation. Our humanized approach reduces stress by 80%. First consultation is free to help you overcome fear.",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
    cta: "Overcome your fear",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "Comprehensive Solutions",
    description: "From complex cavities to full reconstructions. We evaluate 32 aspects of your oral health with 3D technology to create a personalized plan. Over 200 success cases last year.",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    cta: "Complete evaluation",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  },
  {
    title: "Tooth Sensitivity",
    description: "Pain with hot/cold? We solve sensitivity in 1-2 sessions with laser treatments and fluoride nanoparticles. 95% proven effectiveness according to clinical studies.",
    img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    cta: "Relieve sensitivity",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />

  },
  {
    title: "Specialized Pediatric Dentistry",
    description: "Our 'magic corner' makes kids love their visits. We detect early problems with interactive games and use biocompatible materials. Schedule their first positive experience.",
    img: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb",
    cta: "Appointment for your child",
    icon: <FaTooth className="text-3xl text-[#9cc115]" />
  }
];

const DentalCarousel: React.FC = () => {
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
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
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
    const autoSlide = setInterval(nextSlide, 7000);
    return () => clearInterval(autoSlide);
  }, []);

  const slides = isEnglish ? slidesEN : slidesES;

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isEnglish ? "Premium Dental Care" : "Cuidado Dental"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isEnglish
              ? "Experience the highest standard of dental treatments"
              : "Experimenta el más alto estándar en tratamientos dentales"}
          </p>
        </div>

        <div className="relative">
          <div className="relative h-[500px] overflow-hidden rounded-2xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 flex flex-col md:flex-row ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {/* Imagen */}
                <div className="w-full md:w-1/2 h-64 md:h-full relative">
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/30 to-transparent" />
                </div>
                
                {/* Contenido */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
                  <div className="mb-6">
                    {slide.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="#reserva"
                      className="flex items-center justify-center gap-2 bg-[#9cc115] hover:bg-[#9cc115] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaCalendarAlt />
                      {isEnglish ? "Book Now" : "Reservar Ahora"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles */}
          <div className="flex justify-between items-center mt-8">
            {/* Indicadores */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-[#9cc115] w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={isEnglish ? `Go to slide ${index + 1}` : `Ir a diapositiva ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Flechas de navegación */}
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white text-[#9cc115] shadow-md hover:bg-[#9cc115] hover:text-white transition-all duration-300"
                aria-label={isEnglish ? "Previous slide" : "Diapositiva anterior"}
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white text-[#9cc115] shadow-md hover:bg-[#9cc115] hover:text-white transition-all duration-300"
                aria-label={isEnglish ? "Next slide" : "Siguiente diapositiva"}
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-teal-100/50 blur-3xl -z-10" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-blue-100/50 blur-3xl -z-10" />
    </div>
  );
};

export default DentalCarousel;