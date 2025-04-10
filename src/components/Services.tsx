import React, { useState } from "react";

interface Tratamiento {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
}

const tratamientos: Tratamiento[] = [
  {
    id: 1,
    nombre: "Endodoncia",
    imagen: "images/endo.png",
    descripcion:
      "La endodoncia es un tratamiento dental que consiste en la extracción de la pulpa del diente, un tejido pequeño en forma de hebra, que se encuentra en el centro del conducto del diente.",
  },
  {
    id: 2,
    nombre: "Ortodoncia",
    imagen: "images/orto.png",
    descripcion:
      "La ortodoncia es una especialidad de la odontología que se encarga de la corrección de los dientes y huesos posicionados incorrectamente.",
  },
  {
    id: 3,
    nombre: "Implantes Dentales",
    imagen: "images/implante.png",
    descripcion:
      "Los implantes dentales son raíces artificiales que se colocan en el hueso maxilar para sostener dientes de reemplazo.",
  },
  {
    id: 4,
    nombre: "Cirugía Oral",
    imagen: "images/cirugia.png",
    descripcion:
      "Incluye extracciones complejas, tratamiento de infecciones y procedimientos reconstructivos.",
  },
  {
    id: 5,
    nombre: "Prótesis Dentales",
    imagen: "images/protesis.png",
    descripcion:
      "Dispositivos que reemplazan dientes perdidos, pueden ser fijos o removibles.",
  },
  {
    id: 6,
    nombre: "Coronas",
    imagen: "images/corona.png",
    descripcion:
      "Las coronas son una reconstrucción que funciona como una cubierta para el diente con la simetría y el color natural del diente.",
  },
  {
    id: 7,
    nombre: "Ortopediatra",
    imagen: "images/orto.png",
    descripcion:
      "Ortodoncia especializada en niños para guiar el crecimiento facial y dental.",
  },
  {
    id: 8,
    nombre: "Resinas",
    imagen: "images/resinas.png",
    descripcion:
      "Material estético para restaurar dientes cariados o fracturados.",
  },
  {
    id: 9,
    nombre: "Periodoncia",
    imagen: "images/perio.png",
    descripcion: "Tratamiento de las encías y hueso que sostiene los dientes.",
  },
];

const Services: React.FC = () => {
  const [selectedTratamiento, setSelectedTratamiento] = useState<Tratamiento>(
    tratamientos[0]
  );

  return (
    <section
      id="servicios-dentales"
      className="bg-[#f8fcec] py-16 px-4 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Nuestros Tratamientos
        </h2>
        <p className="text-lg text-center text-gray-600 mb-12">
          Profesionales en tu salud dental
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de tratamientos */}
          <div className="w-full lg:w-1/3 border-r border-gray-300 pr-4 overflow-y-auto max-h-[600px]">
            {tratamientos.map((tratamiento) => (
              <div
                key={tratamiento.id}
                className={`flex items-center gap-4 p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedTratamiento.id === tratamiento.id
                    ? "bg-reforma-hover border-l-4 border-white shadow-lg text-white"
                    : "bg-white hover:shadow-md"
                }`}
                onClick={() => setSelectedTratamiento(tratamiento)}
              >
                <img
                  src={tratamiento.imagen}
                  alt={tratamiento.nombre}
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-lg font-semibold ">{tratamiento.nombre}</h3>
              </div>
            ))}
          </div>

          {/* Detalle del tratamiento */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <img
                src={selectedTratamiento.imagen}
                alt={selectedTratamiento.nombre}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedTratamiento.nombre}
              </h3>
              <div className="w-16 h-1 bg-[#9cc115] mx-auto mt-2"></div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
              {selectedTratamiento.descripcion}
            </p>
            <button className="block mx-auto bg-[#9cc115] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-[#7a9a12] transition-all">
              Solicitar consulta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
