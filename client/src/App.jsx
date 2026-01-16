import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ fecha: '', sexo: 'M', extra: '' });
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buscarPalabra = async () => {
    if (!formData.fecha) return alert("Por favor selecciona una fecha");
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

  // --- NUEVA FUNCIÓN DE COMPARTIR ---
  const handleShare = async () => {
    if (!resultado) return;

    const shareData = {
      title: 'Mi Palabra Diaria',
      text: `Hoy recibí esta palabra: "${resultado.texto}" - ${resultado.cita}`,
      url: window.location.href // Comparte el link de tu app
    };

    try {
      // Intenta abrir el menú nativo del celular (iPhone/Android)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Si está en PC y no soporta nativo, abre WhatsApp Web
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

        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
        </div>

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
            
            {/* --- NUEVO BOTÓN COMPARTIR --- */}
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