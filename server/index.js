const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// Usa el puerto que diga el entorno (Coolify) o el 3000 por defecto
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- BASE DE DATOS DE VERSÍCULOS (Centralizada) ---
// Al tenerlos aquí, evitamos errores de conexión con APIs externas y aseguramos el español.
const versiculos = [
    { cita: "Jeremías 29:11", texto: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis." },
    { cita: "Filipenses 4:13", texto: "Todo lo puedo en Cristo que me fortalece." },
    { cita: "Salmos 23:1", texto: "Jehová es mi pastor; nada me faltará." },
    { cita: "Juan 3:16", texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna." },
    { cita: "Proverbios 3:5", texto: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia." },
    { cita: "Isaías 41:10", texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia." },
    { cita: "Romanos 8:28", texto: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados." },
    { cita: "Josué 1:9", texto: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas." },
    { cita: "Salmos 91:1-2", texto: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré." },
    { cita: "Mateo 11:28", texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
    { cita: "2 Timoteo 1:7", texto: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." },
    { cita: "Salmos 37:4", texto: "Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón." },
    { cita: "Proverbios 16:3", texto: "Encomienda a Jehová tus obras, y tus pensamientos serán afirmados." },
    { cita: "Lamentaciones 3:22-23", texto: "Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad." },
    { cita: "Isaías 40:31", texto: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán." }
];

// --- LÓGICA DEL ALGORITMO DIARIO ---
function obtenerIndice(fecha, sexo, extra) {
    // 1. Obtenemos la fecha de HOY (Formato YYYY-MM-DD)
    // Esto es lo que hace que cambie cada día.
    const hoy = new Date().toISOString().split('T')[0]; 

    // 2. Creamos una "semilla" única combinando tus datos + la fecha de hoy
    const inputString = `${fecha}-${sexo}-${extra ? extra.toLowerCase().trim() : ''}-${hoy}`;
    
    // 3. Convertimos esa semilla en un número (Hash simple)
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 4. Aseguramos que sea positivo y que esté dentro del rango de nuestra lista
    return Math.abs(hash) % versiculos.length;
}

// --- API ENDPOINT ---
app.post('/api/palabra', (req, res) => {
    const { fecha, sexo, extra } = req.body;

    if (!fecha || !sexo) {
        return res.status(400).json({ error: "Faltan datos requeridos (fecha o sexo)." });
    }

    try {
        const indice = obtenerIndice(fecha, sexo, extra);
        const versiculoSeleccionado = versiculos[indice];
        
        // Enviamos la respuesta
        res.json(versiculoSeleccionado);
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Hubo un error interno al procesar tu palabra." });
    }
});

// --- SERVIR EL FRONTEND (REACT) ---
// Esto permite que Node sirva los archivos estáticos que generó Vite
// La ruta '../client/dist' es correcta según tu estructura de carpetas y Dockerfile
app.use(express.static(path.join(__dirname, '../client/dist')));

// Cualquier otra petición que no sea /api/palabra, devuelve la app de React
// Esto es necesario para que el routing de React funcione bien si lo usaras
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});