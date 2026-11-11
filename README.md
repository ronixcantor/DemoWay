# DemoWay — El camino de la democracia

Prototipo **jugable, responsive y sin conexión**, con Mocra, un búho profesor animado.

## Cómo jugar

1. Abre `index.html` en Chrome, Firefox, Edge o Safari.
2. Pulsa **Comenzar aventura**, selecciona **Modo Expo** o **Aventura completa**, elige entre 1 y 4 jugadores y escribe los nombres.
3. Sigue el tutorial guiado por Mocra (o sáltalo).
4. Lanza el dado y juega con el mismo dispositivo por turnos. Las casillas muestran preguntas, votaciones y eventos.

### Reglas

- **Modo Expo:** tres turnos por jugador; gana quien logre más puntos. Si empatan en puntos, desempata el avance.
- **Aventura completa:** gana el primero en alcanzar la casilla final.
- **Pregunta correcta:** +20 puntos. Las respuestas incorrectas muestran la explicación sin penalización.
- **Votación:** cada participante elige una opción; +10 puntos por voto adecuado.
- **Bonus:** +5 puntos y +2 casillas. **Obstáculo:** retrocede 2 casillas.
- **Captura:** al coincidir con una ficha de otro jugador, este retrocede 3 casillas y quien captura recibe 10 puntos. No se capturan fichas en las casillas de inicio, meta o Constitución.

## Estructura

```text
DemoWay/
├── index.html             # Pantallas, tablero, ventanas emergentes, SVG de Mocra
├── styles.css             # Diseño, animación y estilos responsive
├── app.js                 # Reglas, preguntas, dado, turnos y votaciones
├── assets/
│   └── favicon.svg        # Icono propio
└── README.md              # Instrucciones y reglas
```

## Tecnologías

HTML5, CSS3 (Grid, Flexbox y animaciones), JavaScript nativo, SVG y Web Audio API. Sin frameworks ni instalaciones. Todo el contenido esencial se incluye localmente. Los efectos sonoros son sintetizados, no pistas de música.

## Para publicarlo en GitHub Pages

Sube toda la carpeta al repositorio, con `index.html` en su raíz (o publica la carpeta elegida mediante GitHub Pages). Configura **Settings → Pages → Deploy from a branch** y selecciona la rama y la carpeta correspondiente. No necesita servidor ni base de datos.

## Alcance de esta versión

- Diseñada para jugadores locales **en el mismo dispositivo**; aún no ofrece multijugador en línea ni adversarios controlados por IA.
- Tablero, personajes, casillas especiales y cuestionarios completamente funcionales.
- Los contenidos educativos están simplificados para un ejercicio didáctico. Fuente de consulta: [Constitución Política de Colombia de 1991 — Función Pública](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=4125).

Proyecto académico de Constitución y Democracia — Ronald Cantor, Ingeniería Multimedia.
