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
    { cita: "Isaías 40:31", texto: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán." },
    { cita: "Salmos 46:1", texto: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones." },
    { cita: "Salmos 121:1-2", texto: "Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra." },
    { cita: "Isaías 54:17", texto: "Ninguna arma forjada contra ti prosperará, y condenarás toda lengua que se levante contra ti en juicio." },
    { cita: "Mateo 6:33", texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas." },
    { cita: "1 Corintios 13:4", texto: "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece." },
    { cita: "Salmos 34:7", texto: "El ángel de Jehová acampa alrededor de los que le temen, y los defiende." },
    { cita: "Romanos 12:2", texto: "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento." },
    { cita: "Gálatas 5:22-23", texto: "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza." },
    { cita: "Efesios 2:8", texto: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios." },
    { cita: "Hebreos 11:1", texto: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve." },
    { cita: "Santiago 1:5", texto: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada." },
    { cita: "1 Juan 1:9", texto: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad." },
    { cita: "Apocalipsis 3:20", texto: "He aquí, yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo." },
    { cita: "Salmos 119:105", texto: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." },
    { cita: "Proverbios 18:10", texto: "Torre fuerte es el nombre de Jehová; a él correrá el justo, y será levantado." },
    { cita: "Isaías 9:6", texto: "Porque un niño nos es nacido, hijo nos es dado, y el principado sobre su hombro; y se llamará su nombre Admirable, Consejero, Dios Fuerte, Padre Eterno, Príncipe de Paz." },
    { cita: "Mateo 28:20", texto: "Y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo." },
    { cita: "Marcos 9:23", texto: "Jesús le dijo: Si puedes creer, al que cree todo le es posible." },
    { cita: "Lucas 1:37", texto: "Porque nada hay imposible para Dios." },
    { cita: "Juan 14:6", texto: "Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí." },
    { cita: "Romanos 8:31", texto: "¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?" },
    { cita: "1 Corintios 16:14", texto: "Todas vuestras cosas sean hechas con amor." },
    { cita: "2 Corintios 5:17", texto: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas." },
    { cita: "Efesios 6:10", texto: "Por lo demás, hermanos míos, fortaleceos en el Señor, y en el poder de su fuerza." },
    { cita: "Filipenses 4:6-7", texto: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." },
    { cita: "Colosenses 3:23", texto: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres." },
    { cita: "1 Tesalonicenses 5:16-18", texto: "Estad siempre gozosos. Orad sin cesar. Dad gracias en todo." },
    { cita: "Hebreos 13:8", texto: "Jesucristo es el mismo ayer, y hoy, y por los siglos." },
    { cita: "Santiago 4:7", texto: "Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros." },
    { cita: "1 Pedro 5:7", texto: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." },
    { cita: "Salmos 27:1", texto: "Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida; ¿de quién he de atemorizarme?" },
    { cita: "Isaías 26:3", texto: "Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado." },
    { cita: "Mateo 5:14", texto: "Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder." },
    { cita: "Juan 8:32", texto: "Y conoceréis la verdad, y la verdad os hará libres." },
    { cita: "Romanos 5:8", texto: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros." }
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