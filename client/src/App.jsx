import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Estado original
  const [formData, setFormData] = useState({ fecha: '', sexo: 'M', extra: '' });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados locales para manejar los selectores separados
  const [dob, setDob] = useState({ day: '', month: '', year: '' });

  // Listas para los desplegables
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  // Años desde 1940 hasta el actual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i);

  // Cada vez que cambia día, mes o año, actualizamos la fecha real para el backend
  useEffect(() => {
    if (dob.day && dob.month && dob.year) {
      // Formato YYYY-MM-DD
      const formattedDate = `${dob.year}-${dob.month.padStart(2, '0')}-${dob.day.padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, fecha: formattedDate }));
    }
  }, [dob]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejador especial para los 3 selects
  const handleDateChange = (e) => {
    setDob({ ...dob, [e.target.name]: e.target.value });
  };

  const buscarPalabra = async () => {
    if (!formData.fecha) return alert("Por favor completa tu fecha de nacimiento");
    setLoading(true);
    try {
      const res = await axios.post('/api/palabra', formData);
      setResultado(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al conectar");
    }
    setLoading(false);
  };

  const handleShare = async () => {
    if (!resultado) return;
    const shareData = {
      title: 'Mi Palabra Diaria',
      text: `Hoy recibí esta palabra: "${resultado.texto}" - ${resultado.cita}`,
      url: window.location.href 
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, '_blank');
      }
    } catch (err) {
      console.log('Error al compartir:', err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Palabra Diaria</h1>
        <p className="subtitle">Descubre el versículo designado para ti hoy.</p>

        {/* --- AQUÍ ESTÁ EL CAMBIO: SECCIÓN DE FECHA --- */}
        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <div className="date-selectors">
            
            {/* Día */}
            <select name="day" value={dob.day} onChange={handleDateChange} className="select-date">
              <option value="">Día</option>
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {/* Mes */}
            <select name="month" value={dob.month} onChange={handleDateChange} className="select-date">
              <option value="">Mes</option>
              {months.map((m, index) => (
                <option key={index} value={index + 1}>{m}</option>
              ))}
            </select>

            {/* Año */}
            <select name="year" value={dob.year} onChange={handleDateChange} className="select-date">
              <option value="">Año</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

          </div>
        </div>
        {/* --------------------------------------------- */}

        <div className="form-group">
          <label>Sexo</label>
          <select name="sexo" value={formData.sexo} onChange={handleChange}>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tu Nombre (Opcional)</label>
          <input type="text" name="extra" placeholder="Ej. Juan" value={formData.extra} onChange={handleChange} />
        </div>

        <button className="btn-primary" onClick={buscarPalabra} disabled={loading}>
          {loading ? "Buscando..." : "Revelar Palabra"}
        </button>

        {resultado && (
          <div className="result-box">
            <p className="verse-text">"{resultado.texto}"</p>
            <span className="verse-ref">{resultado.cita}</span>
            <button className="btn-share" onClick={handleShare}>
              Compartir 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '8px'}}>
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;