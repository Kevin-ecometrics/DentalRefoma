import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { format, parseISO } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PdfImage,
} from "@react-pdf/renderer";

interface Cita {
  nombre_paciente: string;
  correo: string;
  telefono: string;
  fecha: string;
  hora: string;
}

interface CitaOcupada {
  fecha: string;
  hora: string;
}

// Textos en español e inglés
const translations = {
  es: {
    title: "Agenda tu cita en DentalReforma",
    nombre: "Nombre completo",
    correo: "Correo electrónico",
    telefono: "Teléfono",
    hora: "Hora",
    selectHour: "Selecciona una hora",
    agendar: "Agendar cita",
    confirmTitle: "Confirmar cita",
    confirmText: "¿Estás seguro de agendar esta cita?",
    cancel: "Cancelar",
    confirm: "Confirmar",
    successTitle: "¡Cita agendada con éxito!",
    successText: "Tu cita ha sido registrada correctamente.",
    close: "Cerrar",
    download: "Descargar PDF",
    preparing: "Preparando PDF...",
    details: "Detalles de la cita:",
    phoneError: "El teléfono debe tener exactamente 10 dígitos",
    requiredError: "Por favor selecciona una fecha y hora",
    bookedError:
      "Esta cita ya ha sido reservada, por favor selecciona otra hora",
    loadError:
      "No se pudieron cargar las citas disponibles. Por favor intenta recargar la página.",
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    am: "AM",
    pm: "PM",
    pdfTitle: "Comprobante de Cita",
    pdfPatient: "Información del Paciente:",
    pdfDetails: "Detalles de la Cita:",
    pdfName: "Nombre",
    pdfEmail: "Correo",
    pdfPhone: "Teléfono",
    pdfDate: "Fecha",
    pdfTime: "Hora",
  },
  en: {
    title: "Book your appointment at DentalReforma",
    nombre: "Full name",
    correo: "Email",
    telefono: "Phone",
    hora: "Time",
    selectHour: "Select a time",
    agendar: "Book appointment",
    confirmTitle: "Confirm appointment",
    confirmText: "Are you sure you want to book this appointment?",
    cancel: "Cancel",
    confirm: "Confirm",
    successTitle: "Appointment booked successfully!",
    successText: "Your appointment has been registered correctly.",
    close: "Close",
    download: "Download PDF",
    preparing: "Preparing PDF...",
    details: "Appointment details:",
    phoneError: "Phone must have exactly 10 digits",
    requiredError: "Please select a date and time",
    bookedError:
      "This appointment has already been booked, please select another time",
    loadError:
      "Could not load available appointments. Please try reloading the page.",
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    am: "AM",
    pm: "PM",
    pdfTitle: "Appointment Receipt",
    pdfPatient: "Patient Information:",
    pdfDetails: "Appointment Details:",
    pdfName: "Name",
    pdfEmail: "Email",
    pdfPhone: "Phone",
    pdfDate: "Date",
    pdfTime: "Time",
  },
};

// Componente para el PDF
const CitaPDF = ({ cita, lang }: { cita: Cita; lang: string }) => {
  const t = translations[lang as keyof typeof translations];

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#FFFFFF",
      padding: 20,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 20,
      color: "#9cc115",
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: "bold",
    },
    text: {
      fontSize: 14,
      marginBottom: 5,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <PdfImage
              src="/images/logo.webp"
              style={{ width: 100, height: 100 }}
            />
          </View>

          <Text style={styles.title}>{t.pdfTitle}</Text>

          <Text style={styles.subtitle}>{t.pdfPatient}</Text>
          <Text style={styles.text}>
            {t.pdfName}: {cita.nombre_paciente}
          </Text>
          <Text style={styles.text}>
            {t.pdfEmail}: {cita.correo}
          </Text>
          <Text style={styles.text}>
            {t.pdfPhone}: {cita.telefono}
          </Text>

          <Text style={styles.subtitle}>{t.pdfDetails}</Text>
          <Text style={styles.text}>
            {t.pdfDate}:{" "}
            {format(parseISO(cita.fecha), "PPPP", {
              locale: lang === "es" ? es : enUS,
            })}
          </Text>
          <Text style={styles.text}>
            {t.pdfTime}: {cita.hora.substring(0, 5)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default function Agenda() {
  // Detectar el idioma basado en la URL
  const [lang, setLang] = useState<"es" | "en">(
    window.location.pathname.startsWith("/en/") ? "en" : "es"
  );
  const t = translations[lang];

  const [formData, setFormData] = useState<Cita>({
    nombre_paciente: "",
    correo: "",
    telefono: "",
    fecha: "",
    hora: "",
  });

  const [citasOcupadas, setCitasOcupadas] = useState<CitaOcupada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showAllDays, setShowAllDays] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successCita, setSuccessCita] = useState<Cita | null>(null);

  // Función para formatear fecha como YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Función para obtener nombre del mes
  const getMonthName = (date: Date) => {
    return t.months[date.getMonth()];
  };

  // Verificar si una fecha está completamente ocupada
  const isDateFull = (date: Date) => {
    const formattedDate = formatDate(date);
    const horasOcupadas = citasOcupadas.filter(
      (c) => c.fecha === formattedDate
    ).length;
    const totalHorasDisponibles = 9; // De 9am a 6pm son 9 horas

    return horasOcupadas >= totalHorasDisponibles;
  };

  // Generar días disponibles para el mes actual
  const generateAvailableDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(currentMonth);
    startDate.setDate(1);

    const endDate = new Date(currentMonth);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);

    // Ajustar para mostrar semanas completas (empezando en Lunes/Domingo según idioma)
    const startDay = startDate.getDay();
    const prevMonthDays = startDay === 0 ? 6 : startDay - 1;
    startDate.setDate(startDate.getDate() - prevMonthDays);

    const totalDays = showAllDays ? 42 : 35; // 5 o 6 semanas

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  // Verificar si es domingo (no laborable)
  const isSunday = (date: Date) => date.getDay() === 0;

  // Verificar si es hoy
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Verificar si una fecha es pasada
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today && !isToday(date);
  };

  // Generar horas disponibles (filtra las ocupadas)
  const generateAvailableHours = (date: Date | null) => {
    const hours = [];
    const startHour = 9;
    const endHour = 18;

    if (!date) return [];

    const formattedDate = formatDate(date);

    // Obtener todas las horas ocupadas para esta fecha
    const horasOcupadasParaFecha = citasOcupadas
      .filter((cita) => {
        // Asegurarse de que la fecha coincida exactamente
        const citaFecha = cita.fecha.split("T")[0]; // Extraer solo la parte de la fecha (YYYY-MM-DD)
        return citaFecha === formattedDate;
      })
      .map((cita) => cita.hora.substring(0, 5)); // Solo comparamos HH:MM

    for (let hour = startHour; hour < endHour; hour++) {
      const timeValue = `${hour < 10 ? "0" + hour : hour}:00`;
      const isOccupied = horasOcupadasParaFecha.includes(timeValue);

      if (!isOccupied) {
        hours.push({
          value: `${timeValue}:00`, // Mantener formato completo para el valor
          label: `${hour}:00 ${hour < 12 ? t.am : t.pm}`,
          hour: hour,
        });
      }
    }

    return hours;
  };

  // Manejar selección de fecha
  const handleDateSelection = (date: Date) => {
    // Solo permitir seleccionar fechas futuras o hoy, no domingos y no completamente ocupadas
    if (isPastDate(date) && !isToday(date)) return;
    if (isSunday(date)) return;
    if (isDateFull(date)) return;

    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      fecha: formatDate(date),
      hora: "",
    }));
  };

  // Cambiar mes
  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  // Obtener citas ocupadas
  const fetchCitasOcupadas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3001/api/citas/ocupadas");

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCitasOcupadas(data);
    } catch (err) {
      console.error("Error al obtener citas ocupadas:", err);
      setError(t.loadError);
    } finally {
      setInitialLoad(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCitasOcupadas();
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [lang]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Validación especial para teléfono
    if (name === "telefono") {
      // Solo permitir números y máximo 10 dígitos
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();

    // Validar que no sea una cita ya ocupada
    if (selectedDate) {
      const fechaSeleccionada = formatDate(selectedDate);
      const horaSeleccionada = formData.hora;

      const citaOcupada = citasOcupadas.some((c) => {
        const citaFecha = c.fecha.split("T")[0]; // Extraer solo la parte de la fecha
        return citaFecha === fechaSeleccionada && c.hora === horaSeleccionada;
      });

      if (citaOcupada) {
        setError(t.bookedError);
        return;
      }
    }

    // Validar teléfono
    if (formData.telefono.length !== 10) {
      setError(t.phoneError);
      return;
    }

    // Validar campos requeridos
    if (!selectedDate || !formData.hora) {
      setError(t.requiredError);
      return;
    }

    setError("");
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/citas/agendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error("Error al agendar la cita (Elija otra fecha u hora)");

      const nuevaCita = {
        fecha: formData.fecha,
        hora: formData.hora,
      };
      setCitasOcupadas((prev) => [...prev, nuevaCita]);

      // Mostrar modal de éxito
      setSuccessCita({ ...formData });
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        nombre_paciente: "",
        correo: "",
        telefono: "",
        fecha: "",
        hora: "",
      });
      setSelectedDate(null);

      // Recargar citas ocupadas para asegurar consistencia
      fetchCitasOcupadas();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al agendar la cita"
      );
    } finally {
      setLoading(false);
    }
  };

  const availableHours = selectedDate
    ? generateAvailableHours(selectedDate)
    : [];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 pb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {t.title}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Formulario a la izquierda */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div>
                <label
                  htmlFor="nombre_paciente"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t.nombre}
                </label>
                <input
                  type="text"
                  id="nombre_paciente"
                  name="nombre_paciente"
                  value={formData.nombre_paciente}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9cc115] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t.correo}
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9cc115] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t.telefono}
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9cc115] focus:border-transparent"
                />
                {formData.telefono.length !== 10 &&
                  formData.telefono.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">{t.phoneError}</p>
                  )}
              </div>

              {selectedDate && (
                <div>
                  <label
                    htmlFor="hora"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.hora}
                  </label>
                  <select
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9cc115] focus:border-transparent"
                  >
                    <option value="">{t.selectHour}</option>
                    {availableHours.map((horario) => (
                      <option key={horario.value} value={horario.value}>
                        {horario.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#9cc115] hover:bg-[#8ab013]"
                  }`}
                >
                  {t.agendar}
                </button>
              </div>
            </form>
          </div>

          {/* Calendario a la derecha */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h3 className="text-xl font-semibold text-gray-800">
                  {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Encabezados de días (Lunes a Domingo) */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {t.days.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateAvailableDays().map((day) => {
                  const dayFormatted = formatDate(day);
                  const isCurrentMonth =
                    day.getMonth() === currentMonth.getMonth();
                  const isDisabled =
                    isSunday(day) ||
                    isPastDate(day) ||
                    !isCurrentMonth ||
                    isDateFull(day);
                  const isSelected =
                    selectedDate && formatDate(selectedDate) === dayFormatted;

                  return (
                    <button
                      key={day.toString()}
                      type="button"
                      onClick={() => handleDateSelection(day)}
                      disabled={isDisabled}
                      className={`p-2 rounded-full text-sm font-medium flex flex-col items-center ${
                        !isCurrentMonth
                          ? "text-gray-300"
                          : isDisabled
                          ? "text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-[#9cc115] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day.getDate()}
                      {isToday(day) && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#9cc115] mt-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    {lang === "es"
                      ? "Cita seleccionada:"
                      : "Selected appointment:"}
                  </h3>
                  <p className="text-gray-700">
                    {selectedDate.toLocaleDateString(
                      lang === "es" ? "es-ES" : "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    {formData.hora && `, ${formData.hora.substring(0, 5)}`}
                  </p>
                </div>
                <img
                  src="/images/logo.webp"
                  alt="Logo DentalReforma"
                  className="w-12 h-12 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{t.confirmTitle}</h3>
            <p className="mb-6">{t.confirmText}</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#9cc115] text-white rounded-lg hover:bg-[#8ab013] disabled:bg-gray-400"
              >
                {loading
                  ? lang === "es"
                    ? "Confirmando..."
                    : "Confirming..."
                  : t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito con logo */}
      {showSuccessModal && successCita && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="text-center mb-2">
              <h3 className="text-xl font-bold mb-2">{t.successTitle}</h3>
              <p className="text-gray-600 mb-4">{t.successText}</p>

              {/* Logo agregado aquí */}
              <div className="flex justify-center my-4">
                <img
                  src="/images/logo.webp"
                  alt="Logo DentalReforma"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">{t.details}</h4>
              <p>
                {t.nombre}: {successCita.nombre_paciente}
              </p>
              <p>
                {t.correo}: {successCita.correo}
              </p>
              <p>
                {t.telefono}: {successCita.telefono}
              </p>
              <p>
                {lang === "es" ? "Fecha" : "Date"}:{" "}
                {format(parseISO(successCita.fecha), "PPPP", {
                  locale: lang === "es" ? es : enUS,
                })}
              </p>
              <p>
                {t.hora}: {successCita.hora.substring(0, 5)}
              </p>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSuccessCita(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex-1"
              >
                {t.close}
              </button>

              <PDFDownloadLink
                document={<CitaPDF cita={successCita} lang={lang} />}
                fileName={`appointment_dentalreforma_${successCita.fecha}.pdf`}
                className="px-4 py-2 bg-reforma text-white rounded-lg hover:bg-reforma-hover flex-1 text-center"
              >
                {({ loading }) => (loading ? t.preparing : t.download)}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
