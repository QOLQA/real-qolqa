## Estructura de Archivos

En este proyecto, la estructura de archivos se divide en varios módulos para facilitar la organización y el mantenimiento del código. A continuación, se presenta una breve descripción de cada módulo:

### `cells.js`

- En este archivo se definen los objetos `column` y `table`.
- Se extiende la funcionalidad del objeto `mxCell` para personalizar los valores que tendrán los vértices.

### `graph.js`

- En este módulo se definen distintos tipos de estilos que se utilizarán en los vértices del grafo.
- Se crea el grafo a partir de un objeto `mxEditor`.
- Se exportan tanto el editor como el grafo.

### `layout.js`

- En este archivo se define el "layout" del grafo, es decir, cómo se agregan los vértices en el modelo.
- Se exporta la función que crea el "layout".

### `modal.js`

- Este módulo define una función que muestra el formulario para agregar un nuevo atributo en un documento.

### `overlays.js`

- En este archivo se definen 4 tipos de "overlays":
  - Para anidar un documento dentro de otro.
  - Para borrar un vértice.
  - Para agregar un atributo en un documento.
  - Para modificar un atributo.

### `toolbar.js`

- Este archivo es el punto de entrada del archivo "index.html".
- Se crea el "grafo" y se configuran algunas funciones globales.
- Además, se crea un "toolbar" en el lado izquierdo que contiene un icono para insertar un nuevo documento en el modelo.

### `userobjects.js`

- En este módulo se implementa la funcionalidad de modificar un atributo.

### `util.js`

- Se configura la librería "mxGraph" en este archivo.

Esta estructura de archivos permite una organización clara y modular del código, lo que facilita el desarrollo y el mantenimiento del proyecto.
