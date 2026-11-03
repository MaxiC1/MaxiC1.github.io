# Sitio de Maximiliano Casanova

Página de servicios con dos temas: claro (cercano, acento naranjo) y oscuro (modo código, acento lima).
Incluye la sección «Control de tóner, por dentro» con un recorrido por 14 pantallas del sistema.

## Datos de contacto

Están en `index.html`. Si cambian, busca y reemplaza:

- `56968350835`: el WhatsApp de los enlaces (código de país, sin `+` ni espacios). Aparece 4 veces.
- `+56 9 6835 0835`: el número como se ve en pantalla.
- `maximiliano.alexander.casanova@gmail.com`: el correo de los enlaces y el que se ve en pantalla.

## Publicar en GitHub Pages

Este repositorio (`MaxiC1.github.io`) se publica solo en https://maxic1.github.io cada vez que cambia la rama `main`. Tarda uno o dos minutos.

Si algún día lo mueves a otro repositorio: sube el contenido a la raíz, entra a **Settings → Pages**, elige **Deploy from a branch** con la rama `main` y la carpeta `/ (root)`, y guarda.

Cuando compres un dominio, se conecta en la misma pantalla, en **Custom domain**.

## Archivos

- `index.html`: todo el contenido.
- `css/estilos.css`: los dos temas. Los colores están como variables al inicio del archivo.
- `js/main.js`: el botón de tema y el recorrido por las pantallas del sistema de tóner.
- `img/toner/`: capturas del sistema de tóner con datos de ejemplo. Cada pantalla tiene 4 tamaños: `-320`, `-800`, el normal (1600 px) y `-completa` (la página entera, para «Ver en grande»).
- `img/favicon.svg`: el ícono de la pestaña.

## Notas

- El tema sigue al del dispositivo. Si alguien lo cambia con el botón, su navegador lo recuerda.
- El código del sistema de tóner no está en este repositorio, solo sus capturas.
