const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- LÓGICA CENTRALIZADA ---
// Lista de referencias (puedes agregar cientos)
const referencias = [
    { ref: "Juan 3:16", id: "JHN.3.16" }, // IDs compatibles con algunas APIs
    { ref: "Salmos 23:1", id: "PSA.23.1" },
    { ref: "Filipenses 4:13", id: "PHP.4.13" },
    { ref: "Jeremías 29:11", id: "JER.29.11" },
    { ref: "Proverbios 3:5", id: "PRO.3.5" }
];

function obtenerIndice(fecha, sexo, extra) {
    const inputString = `${fecha}-${sexo}-${extra.toLowerCase().trim()}`;
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % referencias.length;
}

// API Endpoint
app.post('/api/palabra', async (req, res) => {
    const { fecha, sexo, extra } = req.body;
    if (!fecha || !sexo) return res.status(400).json({ error: "Faltan datos" });

    const item = referencias[obtenerIndice(fecha, sexo, extra || "")];

    try {
        // Usamos una API pública. Ejemplo con BibleApi (inglés/multi) o similar.
        // TRUCO: Para asegurar español RVR1960 gratis, a veces es mejor tener un JSON local grande.
        // Aquí simularemos la respuesta para que veas la estructura.
        
        // Simulación de respuesta (Para producción, conecta aquí la API de 'bolls.life' o tu DB local)
        // const response = await fetch(`https://bolls.life/get-text/RVR1960/${item.id}/`);
        
        // Por ahora, devolvemos el dato calculado + un texto placeholder para que pruebes el diseño
        res.json({
            cita: item.ref,
            texto: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis." // Esto vendría de la API
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el versículo" });
    }
});

// --- SERVIR EL FRONTEND (REACT) ---
// Esto permite que Node sirva los archivos estáticos de React
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});