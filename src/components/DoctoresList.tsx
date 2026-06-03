import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Doctor {
  id: string;
  nombre: string;
  imagen: string;
  titulo: string;
  url: string;
  experiencia: string;
  formacion: string;
  horario: string;
  bio: string;
}

interface DoctoresProps {
  doctores: Doctor[];
  isEnglish: boolean;
}

// Datos de ejemplo para la demostración
const sampleDoctors: Doctor[] = [
  {
    id: "1",
    nombre: "Dr. María González",
    imagen:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face",
    titulo: "Cardiología",
    url: "maria-gonzalez",
    experiencia:
      "15+ años de experiencia en cardiología preventiva y cirugía cardiovascular",
    formacion: "Universidad Nacional Autónoma de México",
    horario: "Lun-Vie 9:00-17:00",
    bio: "Especialista en cardiología con amplia experiencia...",
  },
  {
    id: "2",
    nombre: "Dr. Carlos Rodríguez",
    imagen:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop&crop=face",
    titulo: "Neurología",
    url: "carlos-rodriguez",
    experiencia:
      "12+ años especializándose en trastornos neurológicos y neurocirugia",
    formacion: "Instituto Politécnico Nacional",
    horario: "Mar-Sáb 10:00-18:00",
    bio: "Neurólogo especializado en...",
  },
  {
    id: "3",
    nombre: "Dra. Ana Martínez",
    imagen:
      "https://images.unsplash.com/photo-1594824388876-fad8b026cd5c?w=400&h=300&fit=crop&crop=face",
    titulo: "Pediatría",
    url: "ana-martinez",
    experiencia: "10+ años cuidando la salud infantil y adolescente",
    formacion: "Universidad de Guadalajara",
    horario: "Lun-Vie 8:00-16:00",
    bio: "Pediatra con enfoque en...",
  },
  {
    id: "4",
    nombre: "Dr. Roberto Silva",
    imagen:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop&crop=face",
    titulo: "Ortopedia",
    url: "roberto-silva",
    experiencia: "18+ años en cirugía ortopédica y traumatología deportiva",
    formacion: "Tecnológico de Monterrey",
    horario: "Lun-Jue 9:00-17:00",
    bio: "Ortopedista especializado en...",
  },
  {
    id: "5",
    nombre: "Dra. Laura Hernández",
    imagen:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=300&fit=crop&crop=face",
    titulo: "Dermatología",
    url: "laura-hernandez",
    experiencia: "8+ años en dermatología estética y médica",
    formacion: "Universidad Iberoamericana",
    horario: "Mar-Sáb 11:00-19:00",
    bio: "Dermatóloga especialista en...",
  },
  {
    id: "6",
    nombre: "Dr. Fernando López",
    imagen:
      "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&h=300&fit=crop&crop=face",
    titulo: "Ginecología",
    url: "fernando-lopez",
    experiencia: "14+ años en salud reproductiva y ginecología oncológica",
    formacion: "Universidad Panamericana",
    horario: "Lun-Vie 10:00-18:00",
    bio: "Ginecólogo con especialidad en...",
  },
];

const ITEMS_PER_PAGE = 4;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const pageTransitionVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 300 : -300,
    scale: 0.8,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -300 : 300,
    scale: 0.8,
  }),
};

const DoctoresList: React.FC<DoctoresProps> = ({
  doctores = sampleDoctors,
  isEnglish = false,
}) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const totalPages = Math.ceil(doctores.length / ITEMS_PER_PAGE);
  const pagedDoctores = useMemo(
    () =>
      doctores.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      ),
    [doctores, page]
  );

  const changePage = (newPage: number) => {
    if (newPage === page || loading) return;
    setDirection(newPage > page ? 1 : -1);
    setPendingPage(newPage);
    setLoading(true);
    // Scroll up immediately for instant feedback
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
    setTimeout(() => {
      setPage(newPage);
      setLoading(false);
      setPendingPage(null);
    }, 700);
  };

  const nextPage = () => {
    if (page < totalPages - 1 && !loading) {
      changePage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0 && !loading) {
      changePage(page - 1);
    }
  };

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 py-16 relative">
      {/* Contador de resultados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="text-sm text-gray-600 bg-[#f8fcec] px-4 py-2 rounded-full">
          {isEnglish
            ? `Showing ${page * ITEMS_PER_PAGE + 1}-${Math.min(
                (page + 1) * ITEMS_PER_PAGE,
                doctores.length
              )} of ${doctores.length} specialists`
            : `Mostrando ${page * ITEMS_PER_PAGE + 1}-${Math.min(
                (page + 1) * ITEMS_PER_PAGE,
                doctores.length
              )} de ${doctores.length} especialistas`}
        </div>
        {/* Navegación mejorada */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prevPage}
              disabled={page === 0 || loading}
              className={`p-2 rounded-full border transition-all duration-200 ${
                page === 0 || loading
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-[#f8fcec] hover:border-[#9cc115] hover:text-[#9cc115]"
              }`}
              whileHover={page > 0 && !loading ? { scale: 1.1 } : {}}
              whileTap={page > 0 && !loading ? { scale: 0.95 } : {}}
              aria-label={isEnglish ? "Previous page" : "Página anterior"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <span className="text-sm text-gray-600 px-3">
              {pendingPage !== null ? pendingPage + 1 : page + 1} / {totalPages}
            </span>

            <motion.button
              onClick={nextPage}
              disabled={page === totalPages - 1 || loading}
              className={`p-2 rounded-full border transition-all duration-200 ${
                page === totalPages - 1 || loading
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-[#f8fcec] hover:border-[#9cc115] hover:text-[#9cc115]"
              }`}
              whileHover={
                page < totalPages - 1 && !loading ? { scale: 1.1 } : {}
              }
              whileTap={
                page < totalPages - 1 && !loading ? { scale: 0.95 } : {}
              }
              aria-label={isEnglish ? "Next page" : "Página siguiente"}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Grid de doctores con animaciones mejoradas */}
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col justify-center items-center min-h-[300px]"
        >
          <svg
            className="animate-spin h-12 w-12 text-[#9cc115] mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-[#9cc115] font-semibold text-lg animate-pulse">
            {isEnglish ? "Loading specialists..." : "Cargando especialistas..."}
          </span>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={pageTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1,
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
            >
              {pagedDoctores.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  variants={cardVariants}
                  className="group relative"
                  onHoverStart={() => setHoveredCard(doctor.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 flex flex-col h-full"
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Imagen del doctor con overlay mejorado */}
                    <a
                      className="block relative overflow-hidden aspect-[4/3] cursor-pointer"
                      href={`${
                        isEnglish
                          ? `/en/doctores/${doctor.url}/`
                          : `/doctores/${doctor.url}/`
                      }`}
                      tabIndex={0}
                      aria-label={
                        isEnglish
                          ? `View profile of ${doctor.nombre}`
                          : `Ver perfil de ${doctor.nombre}`
                      }
                    >
                      <motion.img
                        src={doctor.imagen}
                        alt={doctor.nombre}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{
                          scale: hoveredCard === doctor.id ? 1.15 : 1.1,
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Badge de especialidad mejorado */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="absolute top-4 right-4"
                      >
                        <span className="bg-gradient-to-r from-[#9cc115] to-[#8abf14] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border border-white/20">
                          {doctor.titulo}
                        </span>
                      </motion.div>
                      {/* Estado disponible */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full"
                      >
                        <div className="w-2 h-2 bg-[#9cc115] rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-700">
                          {isEnglish ? "Available" : "Disponible"}
                        </span>
                      </motion.div>
                    </a>

                    {/* Contenido de la tarjeta mejorado */}
                    <div className="p-6 flex flex-col flex-grow">
                      <a
                        href={`${
                          isEnglish
                            ? `/en/doctores/${doctor.url}/`
                            : `/doctores/${doctor.url}/`
                        }`}
                        className="group"
                        tabIndex={0}
                        aria-label={
                          isEnglish
                            ? `View profile of ${doctor.nombre}`
                            : `Ver perfil de ${doctor.nombre}`
                        }
                      >
                        <motion.h3
                          className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#9cc115] transition-colors duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          {doctor.nombre}
                        </motion.h3>
                      </a>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {doctor.experiencia}
                      </p>

                      {/* Información adicional con iconos mejorados */}
                      <div className="space-y-3 mb-6">
                        <motion.div
                          className="flex items-center gap-3 text-sm text-gray-600"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="p-2 bg-[#f8fcec] rounded-lg">
                            <svg
                              className="w-4 h-4 text-[#9cc115]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                            </svg>
                          </div>
                          <span className="font-medium">{doctor.horario}</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-3 text-sm text-gray-600"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="p-2 bg-[#f8fcec] rounded-lg">
                            <svg
                              className="w-4 h-4 text-[#9cc115]"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                            </svg>
                          </div>
                          <span className="font-medium line-clamp-1">
                            {doctor.formacion}
                          </span>
                        </motion.div>
                      </div>

                      {/* Botón de acción mejorado */}
                      <motion.a
                        href={`${
                          isEnglish
                            ? `/en/doctores/${doctor.url}/`
                            : `/doctores/${doctor.url}/`
                        }`}
                        className="mt-auto w-full bg-gradient-to-r from-[#9cc115] to-[#8abf14] text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:from-[#8abf14] hover:to-[#9cc115] focus:outline-none focus:ring-4 focus:ring-[#f8fcec] shadow-lg hover:shadow-xl group relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isEnglish ? "View Profile" : "Ver Perfil"}
                          <motion.svg
                            className="w-4 h-4"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </motion.svg>
                        </span>
                      </motion.a>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Indicadores de página mejorados */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center items-center gap-3"
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => changePage(i)}
              disabled={loading}
              className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                page === i
                  ? "bg-[#9cc115] scale-125"
                  : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
              } ${loading ? "cursor-not-allowed opacity-60" : ""}`}
              whileHover={!loading ? { scale: page === i ? 1.25 : 1.3 } : {}}
              whileTap={!loading ? { scale: 0.9 } : {}}
              aria-label={`${isEnglish ? "Page" : "Página"} ${i + 1}`}
            >
              {page === i && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full border-2 border-[#f8fcec]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default DoctoresList;
