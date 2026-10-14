# Traductor de código Morse

## Portada

Aplicación web para convertir texto común a código Morse y descifrar código Morse como texto. Desarrollada con ECMAScript, Webpack y Babel.

## Introducción

El traductor permite seleccionar el sentido de conversión, validar la entrada y copiar el resultado. Acepta letras, números y signos comunes; las tildes se convierten a su letra base.

## Desarrollo

- `public/js/index.js`: mapa de equivalencias, conversiones, validaciones y eventos.
- `public/css/styles.css`: presentación adaptable a escritorio y móvil.
- `webpack.config.js`: servidor de desarrollo y bundle de producción.
- `src/`: código del juego Dragon Ball que estaba en el proyecto antes del traductor.

Instala dependencias y ejecuta la aplicación:

```bash
npm install
npm run dev
```

El servidor indica la URL local. Para compilar la versión de producción:

```bash
npm run build
```

### Capturas y descripción

La vista principal incluye el selector para cambiar entre Texto → Morse y Morse → Texto, campos de entrada y resultado, y acciones para limpiar y copiar. En móvil los campos se apilan verticalmente.

![Traductor Morse en escritorio](docs/captura-principal.png)

![Traductor Morse en móvil](docs/captura-movil.png)

La entrada se valida antes de traducir. Se muestran errores para texto vacío, símbolos no admitidos, códigos Morse desconocidos o separadores de palabra vacíos.

## Despliegue

El workflow de GitHub Actions compila el sitio y publica la página principal en GitHub Pages al subir cambios a `main`. En el repositorio, configura **Settings → Pages → Build and deployment → GitHub Actions**. La URL publicada aparecerá en la ejecución del workflow.

## Conclusiones

Una tabla de correspondencias y reglas de normalización permiten convertir mensajes en ambas direcciones sin servicios externos. Separar la interfaz, la lógica y el build facilita el mantenimiento y el despliegue.
