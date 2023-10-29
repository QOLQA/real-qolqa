import createGraph, {container, editorImagesPath, Graph} from "./graph";
import createLayout from "./layout";
import mx from "./util";
import {generarJSON} from "./action"
import axios from 'axios';

if (!mx.mxClient.isBrowserSupported()) {
  mx.mxUtils.error("Browser is not supported!", 200, false);
} else {

  let tbContainer = document.getElementById("toolbar");

  // Crea un toolbar sin procesamiento de eventos
  let toolbar = new mx.mxToolbar(tbContainer);
  toolbar.enabled = false;

  container.style.background = `url(${editorImagesPath}grid.gif)`;

  if (mx.mxClient.IS_QUIRKS) {
    document.body.style.overflow = "hidden";
    new mx.mxDivResizer(tbContainer);
    new mx.mxDivResizer(container);
  }

  let { graph, editor } = createGraph();
  graph.dropEnabled = true;
  editor.setGraphContainer(container);

  //boton guardar
  // Obtén el botón por su ID
  var BotonSave = document.getElementById("saveButton");

  // Agrega un manejador de eventos al botón
  BotonSave.addEventListener("click", function() {
    console.log(generarJSON(graph))

    // Realizar la solicitud POST al backend de Firebase
    axios.post('http://127.0.0.1:8000/models', generarJSON(graph))
    .then(function (response) {
      // Manejar la respuesta exitosa del servidor si es necesario
      console.log(response);
    })
    .catch(function (error) {
      // Manejar errores, como validación fallida o problemas en el servidor
      console.log(error);
    });
  });

  createLayout(editor);

  // empareja DNd dentro del grafo
  mx.mxDragSource.prototype.getDropTarget = function (graph, x, y) {
    let cell = graph.getCellAt(x, y);

    if (!graph.isValidDropTarget(cell)) {
      cell = null;
    }

    return null;
  };

  // parar la edicion al dar enter o tecla escape
  let keyHandler = new mx.mxKeyHandler(graph);
  let rubberband = new mx.mxRubberband(graph);

  const myGraph = new Graph(graph);
  myGraph.addToolbarItem(toolbar, editorImagesPath + 'swimlane.gif');
}

