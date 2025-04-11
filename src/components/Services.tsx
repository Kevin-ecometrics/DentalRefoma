import React, { useState } from "react";

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
    description:
      "La endodoncia es un tratamiento dental que consiste en la extracción de la pulpa del diente, un tejido pequeño en forma de hebra, que se encuentra en el centro del conducto del diente.",
  },
  {
    id: 2,
    name: "Ortodoncia",
    image: "/images/orto.png",
    description:
      "La ortodoncia es una especialidad de la odontología que se encarga de la corrección de los dientes y huesos posicionados incorrectamente.",
  },
  {
    id: 3,
    name: "Implantes Dentales",
    image: "/images/implante.png",
    description:
      "Los implantes dentales son raíces artificiales que se colocan en el hueso maxilar para sostener dientes de reemplazo.",
  },
  {
    id: 4,
    name: "Cirugía Oral",
    image: "/images/cirugia.png",
    description:
      "Incluye extracciones complejas, tratamiento de infecciones y procedimientos reconstructivos.",
  },
  {
    id: 5,
    name: "Prótesis Dentales",
    image: "/images/protesis.png",
    description:
      "Dispositivos que reemplazan dientes perdidos, pueden ser fijos o removibles.",
  },
  {
    id: 6,
    name: "Coronas",
    image: "/images/corona.png",
    description:
      "Las coronas son una reconstrucción que funciona como una cubierta para el diente con la simetría y el color natural del diente.",
  },
  {
    id: 7,
    name: "Ortopediatra",
    image: "/images/orto.png",
    description:
      "Ortodoncia especializada en niños para guiar el crecimiento facial y dental.",
  },
  {
    id: 8,
    name: "Resinas",
    image: "/images/resinas.png",
    description:
      "Material estético para restaurar dientes cariados o fracturados.",
  },
  {
    id: 9,
    name: "Periodoncia",
    image: "/images/perio.png",
    description: "Tratamiento de las encías y hueso que sostiene los dientes.",
  },
];

const treatmentsEN: Treatment[] = [
  {
    id: 1,
    name: "Endodontics",
    image: "/images/endo.png",
    description:
      "Endodontics is a dental treatment that involves removing the pulp from the tooth, a small thread-like tissue in the center of the root canal.",
  },
  {
    id: 2,
    name: "Orthodontics",
    image: "/images/orto.png",
    description:
      "Orthodontics is a dental specialty that focuses on correcting misaligned teeth and jaw bones.",
  },
  {
    id: 3,
    name: "Dental Implants",
    image: "/images/implante.png",
    description:
      "Dental implants are artificial roots placed in the jawbone to support replacement teeth.",
  },
  {
    id: 4,
    name: "Oral Surgery",
    image: "/images/cirugia.png",
    description:
      "Includes complex extractions, infection treatments, and reconstructive procedures.",
  },
  {
    id: 5,
    name: "Dental Prostheses",
    image: "/images/protesis.png",
    description:
      "Devices that replace missing teeth, which can be fixed or removable.",
  },
  {
    id: 6,
    name: "Crowns",
    image: "/images/corona.png",
    description:
      "Crowns are restorations that act as a cover for the tooth, matching its natural shape and color.",
  },
  {
    id: 7,
    name: "Pediatric Orthodontics",
    image: "/images/orto.png",
    description:
      "Orthodontics specialized in children to guide facial and dental growth.",
  },
  {
    id: 8,
    name: "Resins",
    image: "/images/resinas.png",
    description:
      "Aesthetic material used to restore decayed or fractured teeth.",
  },
  {
    id: 9,
    name: "Periodontics",
    image: "/images/perio.png",
    description: "Treatment of the gums and the bone that supports the teeth.",
  },
];

const Services: React.FC = () => {
  const isEnglish =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en");
  const currentTreatments = isEnglish ? treatmentsEN : treatmentsES;

  const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(
    currentTreatments[0]
  );

  const sectionTitle = isEnglish ? "Our Treatments" : "Nuestros Tratamientos";
  const sectionSubtitle = isEnglish
    ? "Professionals in your dental health"
    : "Profesionales en tu salud dental";
  const buttonText = isEnglish ? "Request Appointment" : "Solicitar consulta";

  return (
    <section id="treatments" className="bg-[#f8fcec] py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {sectionTitle}
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12">
          {sectionSubtitle}
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Treatment list */}
          <div className="w-full lg:w-1/3 border-r border-gray-300 pr-4 overflow-y-auto max-h-[600px]">
            {currentTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className={`flex items-center gap-4 p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedTreatment.id === treatment.id
                    ? "bg-reforma-hover border-l-4 border-white shadow-lg text-white"
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

          {/* Treatment detail */}
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
            <button className="block mx-auto bg-[#9cc115] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#7a9a12] transition-all">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
