import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import QRCode from "qrcode";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 15
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  qrContainer: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  logo: {
    width: 80,
    height: 80
  }
});

// Componente para el PDF
const CitaPDF = ({ cita, qrValue }: { cita: Cita, qrValue: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Comprobante de Cita</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Información del Paciente:</Text>
        <Text style={styles.text}>Nombre: {cita.nombre_paciente}</Text>
        <Text style={styles.text}>Correo: {cita.correo}</Text>
        <Text style={styles.text}>Teléfono: {cita.telefono}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalles de la Cita:</Text>
        <Text style={styles.text}>
          Fecha: {format(parseISO(`${cita.fecha}T${cita.hora}`), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </Text>
        <Text style={styles.text}>
          Hora: {format(parseISO(`${cita.fecha}T${cita.hora}`), "hh:mm a")}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Ubicación:</Text>
        <Text style={styles.text}>Av. Paseo Reforma 5304, Tijuana</Text>
      </View>
      
      <View style={styles.qrContainer}>
        <Image 
          src={`data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${new QRCode({
              value: qrValue,
              size: 100,
              level: 'H'
            }).toString()}</svg>`
          )}`}
          style={{ width: 150, height: 150 }}
        />
      </View>
    </Page>
  </Document>
);

export default function Agenda() {
  const [formData, setFormData] = useState<Cita>({
    nombre_paciente: '',
    correo: '',
    telefono: '',
    fecha: '',
    hora: ''
  });

  const [citasOcupadas, setCitasOcupadas] = useState<CitaOcupada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAllDays, setShowAllDays] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrValue, setQrValue] = useState('https://maps.app.goo.gl/ChJasXTaFvvXdn6W8');
  const [successData, setSuccessData] = useState<Cita | null>(null);

  // Función para formatear fecha como YYYY-MM-DD
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para obtener nombre del mes
  const getMonthName = (date: Date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
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
    
    // Ajustar para mostrar semanas completas
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
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeValue = `${hour < 10 ? '0' + hour : hour}:00:00`;
      const isOccupied = citasOcupadas.some(
        cita => cita.fecha === formattedDate && cita.hora === timeValue
      );
      
      if (!isOccupied) {
        hours.push({
          value: timeValue,
          label: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`,
          hour: hour
        });
      }
    }
    
    return hours;
  };

  // Manejar selección de fecha
  const handleDateSelection = (date: Date) => {
    // Solo permitir seleccionar fechas futuras o hoy, y no domingos
    if (isPastDate(date) && !isToday(date)) return;
    if (isSunday(date)) return;
    
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      fecha: formatDate(date),
      hora: ''
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
      const response = await fetch('/api/citas-ocupadas');
      const data = await response.json();
      setCitasOcupadas(data);
    } catch (err) {
      console.error('Error al obtener citas ocupadas:', err);
    }
  };

  useEffect(() => {
    fetchCitasOcupadas();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/citas/agendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al agendar la cita');
      }

      // Actualizar lista de citas ocupadas
      setCitasOcupadas([...citasOcupadas, {
        fecha: formData.fecha,
        hora: formData.hora
      }]);

      setSuccessData({...formData});
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        nombre_paciente: '',
        correo: '',
        telefono: '',
        fecha: '',
        hora: ''
      });
      setSelectedDate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const availableHours = selectedDate ? generateAvailableHours(selectedDate) : [];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 pb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Agenda tu cita en <span className="text-[#9cc115]">DentalReforma</span>
        </h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Formulario a la izquierda */}
          <div className="w-full md:w-1/2">
            <form onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }} className="space-y-6">
              <div>
                <label htmlFor="nombre_paciente" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
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
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
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
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9cc115] focus:border-transparent"
                />
              </div>

              {selectedDate && (
                <div>
                  <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <select
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9cc115] focus:border-transparent"
                  >
                    <option value="">Selecciona una hora</option>
                    {availableHours.map((horario) => (
                      <option 
                        key={horario.value} 
                        value={horario.value}
                      >
                        {horario.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !formData.hora}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                    loading || !selectedDate || !formData.hora
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#9cc115] hover:bg-[#8ab013]'
                  }`}
                >
                  {loading ? 'Agendando...' : 'Agendar cita'}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-xl font-semibold text-gray-800">
                  {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                </h3>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateAvailableDays().map((day) => {
                  const dayFormatted = formatDate(day);
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const isDisabled = isSunday(day) || isPastDate(day) || !isCurrentMonth;
                  const isSelected = selectedDate && formatDate(selectedDate) === dayFormatted;

                  return (
                    <button
                      key={day.toString()}
                      type="button"
                      onClick={() => handleDateSelection(day)}
                      disabled={isDisabled}
                      className={`p-2 rounded-full text-sm font-medium flex flex-col items-center ${
                        !isCurrentMonth
                          ? 'text-gray-300'
                          : isDisabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#9cc115] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
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

            {/* Información de cita seleccionada con logo */}
            {selectedDate && (
              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Cita seleccionada:
                  </h3>
                  <p className="text-gray-700">
                    {selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {formData.hora && `, ${formData.hora.substring(0, 5)}`}
                  </p>
                </div>
                <img 
                  src="/logo-pequeno.png" 
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Confirmar cita</h3>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Detalles de la cita:</h4>
              <p>Nombre: {formData.nombre_paciente}</p>
              <p>Fecha: {selectedDate?.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p>Hora: {formData.hora?.substring(0, 5)}</p>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-[#9cc115] text-white rounded-lg hover:bg-[#8ab013] disabled:bg-gray-400"
              >
                {loading ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && successData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">¡Cita agendada con éxito!</h3>
              <p className="text-gray-600">Tu cita ha sido registrada correctamente.</p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Detalles de la cita:</h4>
              <p>Nombre: {successData.nombre_paciente}</p>
              <p>
                Fecha: {format(parseISO(`${successData.fecha}T${successData.hora}`), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              <p>
                Hora: {format(parseISO(`${successData.fecha}T${successData.hora}`), "hh:mm a")}
              </p>
              
              <div className="mt-4 text-center">
                <p className="text-sm mb-2">Ubicación: Av. Paseo Reforma 5304, Tijuana</p>
                <div className="bg-white p-2 inline-block">
                  <QRCode 
                    value={qrValue} 
                    size={128}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex-1"
              >
                Cerrar
              </button>
              <PDFDownloadLink
                document={<CitaPDF cita={successData} qrValue={qrValue} />}
                fileName={`cita-dentalreforma-${successData.fecha}.pdf`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex-1 text-center"
              >
                {({ loading }) => (loading ? 'Preparando PDF...' : 'Descargar PDF')}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}