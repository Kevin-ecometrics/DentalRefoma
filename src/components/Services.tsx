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
    description: "Tratamiento dental especializado que consiste en la remoción completa de la pulpa dental cuando esta se encuentra infectada, inflamada o necrótica. El procedimiento implica la limpieza meticulosa de los conductos radiculares, eliminando todo tejido dañado y bacterias, seguido de la desinfección con soluciones antibacterianas. Finalmente, los conductos se sellan herméticamente con materiales biocompatibles para preservar la estructura dental y prevenir nuevas infecciones. Este tratamiento permite conservar dientes que de otra manera requerirían extracción."
  },
  {
    id: 2,
    name: "Ortodoncia",
    image: "/images/orto.png",
    description: "Disciplina odontológica que corrige la posición anómala de los dientes y las discrepancias esqueléticas entre los maxilares. Utiliza diversos sistemas de fuerzas controladas aplicadas mediante aparatología fija (brackets) o removible (alineadores transparentes) para lograr la alineación dental ideal. Los tratamientos buscan establecer una oclusión funcional, mejorar la estética facial y prevenir problemas derivados del mal posicionamiento como desgastes dentales, problemas articulares o dificultades en la masticación y fonación."
  },
  {
    id: 3,
    name: "Implantes Dentales",
    image: "/images/implante.png",
    description: "Solución protésica permanente que reemplaza las raíces dentales perdidas mediante la inserción quirúrgica de tornillos de titanio en el hueso maxilar. Estos implantes, fabricados con materiales biocompatibles, se osteointegran con el hueso circundante durante un periodo de cicatrización. Posteriormente, sirven como base sólida para soportar coronas individuales, puentes o incluso prótesis completas. Ofrecen una alternativa estable y duradera a las prótesis removibles, restaurando la función masticatoria y previniendo la pérdida ósea postextracción."
  },
  {
    id: 4,
    name: "Cirugía Oral",
    image: "/images/cirugia.png",
    description: "Especialidad odontológica que realiza procedimientos quirúrgicos en la cavidad bucal y estructuras adyacentes. Incluye exodoncias complejas (como muelas del juicio impactadas), cirugías preprotésicas (alveoloplastias), colocación de implantes, resección de quistes y tumores benignos, cirugía periodontal regenerativa y procedimientos reconstructivos con injertos óseos. Estos tratamientos requieren conocimientos anatómicos profundos y técnicas quirúrgicas precisas para garantizar resultados seguros y predecibles."
  },
  {
    id: 5,
    name: "Prótesis Dentales",
    image: "/images/protesis.png",
    description: "Dispositivos médicos personalizados que reemplazan parcial o completamente las piezas dentales ausentes. Las prótesis fijas (como coronas y puentes) se cementan sobre dientes pilares o implantes, mientras las removibles (esqueléticos o acrílicos) pueden retirarse para su limpieza. Los diseños modernos incorporan materiales como zirconio, cerómeros y porcelanas de alta resistencia que imitan las propiedades ópticas del esmalte natural. Además de restaurar la función masticatoria, previenen el desplazamiento de dientes remanentes y el colapso de la dimensión vertical."
  },
  {
    id: 6,
    name: "Coronas Dentales",
    image: "/images/corona.png",
    description: "Restauraciones protésicas que encapsulan completamente la porción visible del diente, reconstruyendo su anatomía original después de grandes destrucciones por caries, fracturas o tratamientos endodónticos. Fabricadas en materiales como zirconio, disilicato de litio o aleaciones nobles, proporcionan resistencia a las fuerzas masticatorias mientras reproducen las características ópticas del esmalte natural (translucidez, opalescencia). Su colocación requiere un tallado preciso del diente y toma de registros digitales o físicos para lograr un ajuste marginal perfecto y armonía oclusal."
  },
  {
    id: 7,
    name: "Ortopediatría",
    image: "/images/orto.png",
    description: "Rama de la odontología dedicada al cuidado integral de la salud bucal en pacientes pediátricos desde la infancia hasta la adolescencia. Abarca procedimientos preventivos (aplicación de sellantes y flúor), manejo de caries tempranas con técnicas mínimamente invasivas, tratamientos pulpares en dientes primarios, mantenedores de espacio tras pérdidas prematuras y terapia interceptiva de maloclusiones incipientes. Utiliza enfoques psicológicos adaptados a cada etapa del desarrollo para crear experiencias positivas que fomenten hábitos saludables permanentes."
  },
  {
    id: 8,
    name: "Resinas Compuestas",
    image: "/images/resinas.png",
    description: "Materiales restauradores estéticos compuestos por una matriz resinosa y partículas de relleno inorgánico que permiten reparar dientes afectados por caries, fracturas menores o defectos estéticos. Se aplican en capas siguiendo técnicas de estratificación que reproducen las variaciones cromáticas y translucidez del esmalte natural. Su adhesión química y micromecánica al tejido dental conserva máxima estructura sana, eliminando la necesidad de tallados extensos. Ofrecen durabilidad clínica combinada con excelentes resultados estéticos en restauraciones anteriores y posteriores."
  },
  {
    id: 9,
    name: "Periodoncia",
    image: "/images/perio.png",
    description: "Especialidad que trata las enfermedades que afectan los tejidos de soporte dental (encía, ligamento periodontal y hueso alveolar). Los protocolos terapéuticos incluyen raspado y alisado radicular para eliminar cálculo y biofilm patogénico, terapia antimicrobiana localizada y en casos avanzados, cirugías resectivas o regenerativas. El control periódico y la instrucción en técnicas de higiene personalizada son esenciales para manejar estas condiciones inflamatorias crónicas de origen bacteriano, preservando la dentición natural y evitando sus consecuencias sistémicas."
  }
];

const treatmentsEN: Treatment[] = [
  {
    id: 1,
    name: "Endodontics",
    image: "/images/endo.png",
    description: "Specialized dental treatment involving the complete removal of dental pulp when it becomes infected, inflamed or necrotic. The procedure requires meticulous cleaning of root canals to eliminate damaged tissue and bacteria, followed by disinfection with antibacterial solutions. Canals are then hermetically sealed with biocompatible materials to preserve tooth structure and prevent reinfection. This therapy saves teeth that would otherwise require extraction, maintaining natural dentition and preventing bone loss."
  },
  {
    id: 2,
    name: "Orthodontics",
    image: "/images/orto.png",
    description: "Dental specialty that corrects abnormal tooth positioning and skeletal discrepancies between jaws. It applies controlled forces through fixed appliances (braces) or removable systems (clear aligners) to achieve ideal dental alignment. Treatments aim to establish functional occlusion, improve facial aesthetics, and prevent complications from malpositioning like dental wear, joint problems, or difficulties in chewing and speech. Modern techniques include invisible lingual braces and digitally planned aligner therapy for discreet correction."
  },
  {
    id: 3,
    name: "Dental Implants",
    image: "/images/implante.png",
    description: "Permanent prosthetic solution replacing lost tooth roots through surgical placement of titanium screws in the jawbone. These biocompatible implants osseointegrate with surrounding bone during healing, then serve as solid foundations for single crowns, bridges or full dentures. They offer stable, long-lasting alternatives to removable prosthetics, restoring chewing function while preventing post-extraction bone resorption. Advanced protocols allow immediate loading in select cases, and zygomatic implants for patients with severe bone loss."
  },
  {
    id: 4,
    name: "Oral Surgery",
    image: "/images/cirugia.png",
    description: "Dental specialty performing surgical procedures in the oral cavity and adjacent structures. Includes complex extractions (impacted wisdom teeth), pre-prosthetic surgeries (alveoloplasty), implant placement, resection of cysts and benign tumors, regenerative periodontal surgery, and reconstructive procedures with bone grafts. These treatments demand profound anatomical knowledge and precise surgical techniques to ensure safe outcomes. Modern approaches utilize piezoelectric instruments and growth factors to enhance healing."
  },
  {
    id: 5,
    name: "Dental Prosthetics",
    image: "/images/protesis.png",
    description: "Custom medical devices replacing partial or complete dental arches. Fixed prosthetics (crowns/bridges) are cemented onto abutment teeth or implants, while removable options (partial/full dentures) can be taken out for cleaning. Contemporary designs incorporate zirconia, ceromers and high-strength porcelains mimicking natural enamel optics. Beyond restoring mastication, they prevent remaining teeth from shifting and vertical dimension collapse. Digital workflows now enable same-day ceramic restorations in many cases."
  },
  {
    id: 6,
    name: "Dental Crowns",
    image: "/images/corona.png",
    description: "Prosthetic restorations fully encapsulating the visible tooth portion, rebuilding original anatomy after extensive decay, fractures or endodontic treatment. Fabricated from zirconia, lithium disilicate or noble alloys, they withstand chewing forces while replicating natural enamel's optical traits (translucency, opalescence). Placement requires precise tooth preparation and digital/physical impressions for perfect marginal fit and occlusal harmony. Modern monolithic designs combine strength and aesthetics, eliminating traditional porcelain-fused-to-metal limitations."
  },
  {
    id: 7,
    name: "Pediatric Dentistry",
    image: "/images/orto.png",
    description: "Dental discipline focused on comprehensive oral health for pediatric patients from infancy through adolescence. Encompasses preventive measures (sealants/fluoride), minimally invasive caries management, pulp therapies in primary teeth, space maintainers after premature loss, and interceptive treatment for developing malocclusions. Uses psychological approaches tailored to each developmental stage, creating positive experiences that establish lifelong healthy habits. Specialized behavior guidance techniques help anxious children receive care comfortably."
  },
  {
    id: 8,
    name: "Composite Resins",
    image: "/images/resinas.png",
    description: "Aesthetic restorative materials combining resin matrices with inorganic filler particles to repair teeth affected by decay, minor fractures or cosmetic defects. Applied in layers using stratification techniques that mimic natural enamel's chromatic variations and light transmission. Their chemical/micro-mechanical bonding to tooth structure preserves maximum healthy tissue, avoiding extensive preparations. Contemporary nano-hybrid and bulk-fill composites offer clinical durability paired with exceptional aesthetics for anterior and posterior restorations."
  },
  {
    id: 9,
    name: "Periodontics",
    image: "/images/perio.png",
    description: "Specialty treating diseases affecting tooth-supporting tissues (gums, periodontal ligament and alveolar bone). Therapeutic protocols include scaling/root planing to remove calculus and pathogenic biofilm, localized antimicrobial therapy, and for advanced cases, resective or regenerative surgeries. Periodic maintenance and personalized hygiene instruction are essential to manage these chronic inflammatory conditions of bacterial origin, preserving natural dentition while preventing systemic implications like cardiovascular risks or diabetes complications."
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
                      ? "bg-[#aed136] border-l-4 border-white shadow-lg text-white"
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
                <div className="w-16 h-1 bg-[#aed136] mx-auto mt-2"></div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                {selectedTreatment.description}
              </p>
              <button 
                onClick={scrollToReserva}
                className="block mx-auto bg-[#aed136] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#4f646f] transition-all"
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
        <div className="w-16 h-1 bg-[#aed136] mx-auto mt-2 mb-4"></div>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          {selectedTreatment.description}
        </p>
        <button 
          onClick={scrollToReserva}
          className="mx-auto bg-[#aed136] text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-[#4f646f] transition-all flex items-center justify-center gap-2 text-sm"
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