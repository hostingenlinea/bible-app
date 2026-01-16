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
      // En producción la URL será relativa, en dev puede necesitar localhost
      const res = await axios.post('/api/palabra', formData);
      setResultado(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al conectar");
    }
    setLoading(false);
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;