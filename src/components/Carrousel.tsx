import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaTooth } from "react-icons/fa";

interface Slide {
  img: string;
  title: string;
  description: string;
  alt: string;
  cta: string;
}

const slidesES = [
  {
    title: "Técnica de Cepillado Perfecto",
    description: "Aprende el método de cepillado que recomiendan los odontólogos: usa movimientos suaves y circulares, inclinando el cepillo 45° hacia las encías. No olvides la lengua y mínimo 2 minutos, 3 veces al día. ¡Tu sonrisa lo vale!",
    img: "images/cepillo.webp",
    alt: "Técnica de cepillado perfecto",
    cta: "Agendar limpieza dental"
  },
  {
    title: "El Dentista Sin Dolor Existe",
    description: "Olvida los mitos: la odontología moderna usa técnicas indoloras y sedación consciente. Nuestro enfoque humanizado reduce el estrés en un 80%.",
    img: "images/miedo.webp",
    alt: "Dentista sin dolor",
    cta: "Supera tu miedo ahora"
  },
  {
    title: "Soluciones Integrales",
    description: "Desde caries complejas hasta reconstrucciones completas. Evaluamos 32 aspectos de tu salud bucal con tecnología 3D para crear un plan personalizado. Más de 200 casos exitosos en el último año.",
    img: "images/especializado.webp",
    alt: "Soluciones integrales",
    cta: "Evaluación completa"
  },
  {
    title: "Sensibilidad Dental",
    description: "¿Dolor con lo frío/caliente? Solucionamos la hipersensibilidad en 1-2 sesiones con nuestros tratamientos con láser y nanopartículas de flúor. Eficacia comprobada del 95% según estudios clínicos.",
    img: "images/sensibilidad.webp",
    alt: "Sensibilidad dental",
    cta: "Alivia tu sensibilidad"
  },
  {
    title: "Odontopediatría Especializada",
    description: "Nuestro 'rincón mágico' hace que los niños amen sus visitas. Detectamos problemas tempranos con juegos interactivos y usamos materiales biocompatibles. Programa su primera experiencia positiva.",
    img: "images/nino.webp",
    alt: "Odontopediatría especializada",
    cta: "Cita para tu pequeño"
  }
];

const slidesEN = [
  {
    title: "Perfect Brushing Technique",
    description: "Learn the dentist-recommended method: use gentle circular motions, tilting the brush 45° toward gums. Don't forget your tongue and brush for at least 2 minutes, 3 times daily. Your smile deserves it!",
    img: "images/cepillo.webp",
    alt: "Perfect brushing technique",
    cta: "Book dental cleaning"
  },
  {
    title: "Pain-Free Dentistry is Real",
    description: "Forget the myths: modern dentistry uses painless techniques and conscious sedation. Our humanized approach reduces stress by 80%. First consultation is free to help you overcome fear.",
    img: "images/miedo.webp",
    alt: "Pain-free dentistry",
    cta: "Overcome your fear"
  },
  {
    title: "Comprehensive Solutions",
    description: "From complex cavities to full reconstructions. We evaluate 32 aspects of your oral health with 3D technology to create a personalized plan. Over 200 success cases last year.",
    img: "images/especializado.webp",
    alt: "Comprehensive dental solutions",
    cta: "Complete evaluation"
  },
  {
    title: "Tooth Sensitivity",
    description: "Pain with hot/cold? We solve sensitivity in 1-2 sessions with laser treatments and fluoride nanoparticles. 95% proven effectiveness according to clinical studies.",
    img: "images/sensibilidad.webp",
    alt: "Tooth sensitivity treatment",
    cta: "Relieve sensitivity"
  },
  {
    title: "Specialized Pediatric Dentistry",
    description: "Our 'magic corner' makes kids love their visits. We detect early problems with interactive games and use biocompatible materials. Schedule their first positive experience.",
    img: "images/nino.webp",
    alt: "Pediatric dentistry",
    cta: "Appointment for your child"
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
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const autoSlide = setInterval(nextSlide, 7000);
    return () => clearInterval(autoSlide);
  }, []);

  const slides = isEnglish ? slidesEN : slidesES;

  return (
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:py-16 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado común */}
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {isEnglish ? "Premium Dental Care" : "Cuidado Dental Premium"}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            {isEnglish
              ? "Experience the highest standard of dental treatments"
              : "Experimenta el más alto estándar en tratamientos dentales"}
          </p>
        </div>

        {/* Versión Mobile */}
        <div className="lg:hidden">
          <div className="relative h-[600px] overflow-hidden rounded-xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 flex flex-col ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="w-full h-48 relative">
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="w-full bg-white p-6 flex-1 flex flex-col rounded-b-xl">
                  <div className="flex items-start gap-2 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {slide.title}
                    </h3>
                    <FaTooth className="text-2xl text-[#9cc115] mt-1 flex-shrink-0" />
                  </div>
                  
                  <p className="text-gray-600 mb-6 flex-1">
                    {slide.description}
                  </p>
                  
                  <div className="mt-auto">
                    <a
                      href="#reserva"
                      className="flex items-center justify-center gap-2 bg-[#9cc115] hover:bg-[#8ab013] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg w-full"
                    >
                      <FaCalendarAlt />
                      {slide.cta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all ${index === currentIndex ? 'bg-[#9cc115]' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white text-[#9cc115] shadow-md hover:bg-[#9cc115] hover:text-white transition-all duration-300"
                aria-label="Previous slide"
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white text-[#9cc115] shadow-md hover:bg-[#9cc115] hover:text-white transition-all duration-300"
                aria-label="Next slide"
              >
                <FaChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Versión Desktop */}
        <div className="hidden lg:block">
          <div className="relative h-[500px] overflow-hidden rounded-2xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 flex ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="w-1/2 h-full relative">
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="w-full h-full object-cover rounded-l-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                </div>
                
                <div className="w-1/2 bg-white p-12 flex flex-col justify-center rounded-r-2xl">
                  <div className="mb-8">
                    <FaTooth className="text-4xl text-[#9cc115]" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {slide.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    {slide.description}
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#reserva"
                      className="flex items-center justify-center gap-2 bg-[#9cc115] hover:bg-[#8ab013] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaCalendarAlt />
                      {slide.cta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-[#9cc115] w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white text-[#9cc115] shadow-md hover:bg-[#9cc115] hover:text-white transition-all duration-300"
                aria-label="Previous slide"
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white text-[#9cc115] shadow-md hover:bg-[#9cc115] hover:text-white transition-all duration-300"
                aria-label="Next slide"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#9cc115]/10 blur-3xl -z-10" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-[#9cc115]/10 blur-3xl -z-10" />
    </div>
  );
};

export default DentalCarousel;
